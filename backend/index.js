// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Ollama (local LLaMA via Ollama API)
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/v1/chat/completions';
const LLAMA_MODEL = process.env.LLAMA_MODEL || 'llama3';

// OpenAI configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

app.use(bodyParser.json());
app.use(cors());

const SYSTEM_PROMPT = `
You are **ChatUML**, a teaching assistant that converts plain-language
requirements into clear, self-explanatory *PlantUML* diagrams.

───────────────────────────────  GENERAL RULES  ───────────────────────────────
1. **Output exactly one PlantUML block** – start with \`@startuml\`, end with
   \`@enduml\`.  No Markdown, no prose outside this block.
2. **Pick the most suitable diagram type automatically**  
   • Structural → class, component, deployment, object, ER  
   • Behavioural → sequence, activity, state, use-case, timing  
3. **Focus on teaching value**  
   • Use meaningful names, stereotypes « », labels, and notes.  
   • Show relationships (multiplicity, direction, messages, transitions).  
   • Insert a concise legend or title when helpful.
4. **Syntax hints** (quick cheatsheet)
   ─ Class  : \`class Order { +id : UUID \\n +submit() }\`
              Associations → \`Customer "1" -- "many" Order : places >\`
   ─ Sequence: \`actor User\\nUser -> Auth : login()\\nAuth --> User : JWT\`
   ─ State   : \`[*] --> Idle\\nIdle --> Busy : start / init()\`
   ─ Use-case: \`(Checkout) as UC1\\nCustomer -- UC1\`
   ─ Notes   : \`note right of Order : persisted in table orders\`
5. **Avoid** skinparams, headers, or themes unless explicitly requested.

──────────────────────────────  EXAMPLES  ───────────────────────────────
### 1  Class Diagram – Library
@startuml
class Book {
  +id : UUID
  +title : String
  +borrow() : Loan
}
class Member {
  +memberId : UUID
  +name : String
  +borrow(b: Book) : Loan
}
class Loan {
  +dueDate : Date
  +return()
}
Member "1" -- "many" Loan : borrows >
Book  "1" -- "many" Loan : < loaned
@enduml

### 2  Sequence Diagram – Login Flow
@startuml
actor User
participant "Auth Service" as Auth
database "User DB" as DB

User -> Auth : submitCredentials(email,pwd)
Auth -> DB   : SELECT user
DB   --> Auth: userRecord
Auth -> User : issueJWT(token)
@enduml

### 3  State Diagram – Traffic Light
@startuml
state TrafficLight {
  [*] --> Red
  Red   --> Green  : timer / next()
  Green --> Yellow : timer / next()
  Yellow --> Red   : timer / next()
}
@enduml
`.trim();
// Helper: call local Ollama (LLaMA)
async function callLlama(prompt, temperature = 0.7) {

  const resp = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: LLAMA_MODEL, messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ], temperature
    })
  });
  if (!resp.ok) throw new Error(`Ollama API error ${resp.status}`);
  const { choices } = await resp.json();
  return choices[0].message.content.trim();
}

// Helper: call OpenAI Chat
async function callOpenAI(prompt, temperature = 0.7) {
  if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
  const resp = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model: OPENAI_MODEL, messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ], temperature
    })
  });
  if (!resp.ok) throw new Error(`OpenAI API error ${resp.status}`);
  const { choices } = await resp.json();
  return choices[0].message.content.trim();
}

// PlantUML rendering: via Java JAR
async function renderPlantUML(umlText, format = 'svg') {
  return new Promise((resolve, reject) => {
    const args = ['-jar', '/usr/local/bin/plantuml.jar', '-pipe', format === 'svg' ? '-tsvg' : '-tpng'];
    const proc = spawn('java', args, { stdio: ['pipe', 'pipe', 'inherit'] });
    const chunks = [];
    proc.stdout.on('data', b => chunks.push(b));
    proc.on('close', code => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`PlantUML exited with code ${code}`));
    });
    proc.stdin.write(umlText);
    proc.stdin.end();
  });
}

/**
 * POST /api/prompt
 * Request JSON:
 *   { prompt: string,             // User prompt for diagram generation (required)
 *     model?: 'llama'|'openai',   // Choose backend (default: 'llama')
 *     temperature?: number        // Sampling temperature 0.0 - 1.0 (default: 0.7)
 *   }
 * Response JSON:
 *   { success: true, plantuml: string }
 *   or on error { success: false, error: string }
 */
app.post('/api/prompt', async (req, res) => {
  const { prompt, model = 'llama', temperature = 0.7 } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt must be a non-empty string.' });
  }
  try {
    const plantuml = model === 'openai'
      ? await callOpenAI(prompt, temperature)
      : await callLlama(prompt, temperature);
    res.json({ success: true, plantuml });
  } catch (err) {
    console.error('LLM error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/uml
 * Request JSON:
 *   { plantuml: string,           // PlantUML source generated from /api/prompt (required)
 *     download?: boolean,         // If true, triggers file download (default: false)
 *     format?: 'png'|'svg'        // Output format for download mode (default: 'png')
 *   }
 * Response:
 *   - Inline SVG (download=false):
 *       Content-Type: image/svg+xml
 *       <svg>...</svg>
 *   - Download mode (download=true):
 *       Content-Type: image/png|image/svg+xml
 *       Content-Disposition: attachment; filename="diagram.png|svg"
 *       Binary PNG or SVG text
 *   - On error: JSON { success: false, error: string, plantuml?: string }
 */
app.post('/api/uml', async (req, res) => {
  const { plantuml, download = false, format = 'png' } = req.body;
  if (!plantuml || typeof plantuml !== 'string') {
    return res.status(400).json({ error: 'plantuml must be a string.' });
  }
  if (download && !['png', 'svg'].includes(format)) {
    return res.status(400).json({ error: 'format must be png or svg.' });
  }
  try {
    if (!download) {
      // Inline embed always SVG
      const buf = await renderPlantUML(plantuml, 'svg');
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(buf.toString('utf8'));
    }
    // Download mode
    const buf = await renderPlantUML(plantuml, format);
    const mime = format === 'svg' ? 'image/svg+xml' : 'image/png';
    const ext = format;
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="diagram.${ext}"`);
    if (format === 'svg') res.send(buf.toString('utf8'));
    else res.send(buf);
  } catch (err) {
    console.error('Render error', err);
    res.status(500).json({ success: false, error: err.message, plantuml });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
