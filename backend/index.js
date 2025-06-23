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
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-nano';

app.use(bodyParser.json());
app.use(cors());

// 1) Minimaler System-Prompt: Rolle & Zweck
const SYSTEM_PROMPT = `
You are **ChatUML**, a teaching assistant that converts plain-language
requirements into clear, self-explanatory PlantUML diagrams (including UML, mindmaps, and more).
Always follow the user’s instructions exactly.
`.trim();

// 2) Prompt-Template mit Platzhaltern für Regeln, Beispiele und Anwender-Anfrage
const PROMPT_TEMPLATE = `
=== Conversion Task ===
Convert the following requirement into a PlantUML diagram or mindmap:

{user_input}

=== Rules ===
1. **Single block**: Output exactly one PlantUML block.  
   • Begin with \`@startuml\`/\`@startmindmap\`, end with \`@enduml\`/\`@endmindmap\`.  
   • No additional text or Markdown outside this block.  
2. **Diagram type**: Choose the most suitable type automatically:  
   – Structural: class, component, deployment, object, ER  
   – Behavioural: sequence, activity, state, use-case, timing  
   – Other: mindmap  
3. **Clarity & Teaching**:  
   – Use meaningful names, stereotypes « », labels, notes.  
   – Show relationships (multiplicity, directions, messages, transitions) or hierarchy for mindmaps.  
   – Add a concise title or legend if helpful.  
4. **Syntax cheatsheet** (for reference only):  
   – Class: \`class Order { +id : UUID \\\\n +submit() }\`  
   – Sequence:  
   \`\`\`  
   actor User  
   User -> Auth : login()  
   Auth --> User : JWT  
   \`\`\`  
   – Mindmap:  
   \`\`\`  
   @startmindmap  
   * RootTopic  
   ** SubTopic1  
   ** SubTopic2  
   @endmindmap  
   \`\`\`  
5. **No styling**: Avoid skinparams, themes or headers unless explicitly requested.

=== Examples ===
{examples}

=== Your Diagram ===
`.trim();

// 3) Beispiel-Platzhalter (fülle „{examples}“ später mit konkreten Beispielen)
const EXAMPLES = `
// 1) Class Diagram – Library System
@startuml
class Student {
  +Name: String
}
class Course {
  +Title: String
}
Student "0..*" - "1..*" Course
class Enrollment {
}
(Student, Course) .. Enrollment
@enduml

// 2) Sequence Diagram – Login Flow
@startuml
actor User
participant Auth
database DB
User -> Auth : submitCredentials(email, pwd)
Auth -> DB : SELECT * FROM users
DB --> Auth : userRecord
Auth -> User : JWT
@enduml

// 3) Activity Diagram – Order Process
@startuml
start
:Place Order;
if (In Stock?) then (yes)
  :Ship Item;
else (no)
  :Notify Customer;
endif
stop
@enduml

// 4) Use-Case Diagram – Library System
@startuml
actor "Member" as Member
(usecase "Borrow Book") as UC1
(usecase "Return Book") as UC2
Member -- UC1
Member -- UC2
@enduml

// 5) State Diagram – Traffic Light
@startuml
[*] --> Red
Red --> Green : timer / switch
Green --> Yellow : timer / switch
Yellow --> Red : timer / switch
@enduml

// 6) Component Diagram – E-Commerce
@startuml
component "Web Frontend" as Web
component "API Service" as API
component "Database" as DB
Web --> API : REST
API --> DB : SQL
@enduml

// 7) Deployment Diagram – Cloud Architecture
@startuml
node "Load Balancer" as LB {
}
node "Web Server" as WS {
  component Web
}
node "Database Server" as DS {
  database DB
}
LB --> WS
WS --> DS
@enduml

// 8) ER Diagram – Information Model
@startuml
entity Customer {
  *customer_id : int
  --
  name : string
}
entity Order {
  *order_id : int
  --
  date : date
}
Customer ||--o{ Order : places
@enduml

// 9) Object Diagram – Instance Snapshot
@startuml
object person1 {
  name = "Alice"
  age = 30
}
object person2 {
  name = "Bob"
  age = 25
}
person1 -- person2 : knows
@enduml

// 10) Timing Diagram – Signal States
@startuml
robust "WebBrowser" as WB
concise "WebUser" as WU
@0
WU is Idle
WB is Idle
@+100
WU -> WB : request()
WB is Processing
@+200
WB is Idle
@enduml

// 11) Mindmap – Künstliche Intelligenz
@startmindmap
title Künstliche Intelligenz – Komponenten und Bereiche
* Künstliche Intelligenz
** Grundlagen
*** Definition
*** Geschichte
*** Zielsetzung
** Teilgebiete
*** Maschinelles Lernen
*** Deep Learning
*** Natürliche Sprachverarbeitung
*** Computer Vision
*** Robotik
*** Expertensysteme
** Anwendungen
*** Sprachassistenten
*** Bild- und Spracherkennung
*** Autonomes Fahren
*** Medizinische Diagnostik
*** Empfehlungssysteme
** Technologien
*** Neuronale Netze
*** Entscheidungsbäume
*** Support Vector Machines
*** Reinforcement Learning
*** Big Data
*** Cloud Computing
@endmindmap
`.trim();

// 4) Helper zum Befüllen des Templates
function buildPrompt(userInput) {
  return PROMPT_TEMPLATE
    .replace('{user_input}', userInput)
    .replace('{examples}', EXAMPLES);
}
// Helper: call local Ollama (LLaMA)
async function callLlama(prompt, temperature = 0.7) {
  const fullPrompt = buildPrompt(prompt);
  const resp = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: LLAMA_MODEL, messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: fullPrompt }
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
  const fullPrompt = buildPrompt(prompt);
  const resp = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model: OPENAI_MODEL, messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: fullPrompt }
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
