// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';

const app = express();
const port = process.env.PORT || 3000;

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/v1/chat/completions';
const LLAMA_MODEL = process.env.LLAMA_MODEL || 'llama3';
app.use(bodyParser.json());
app.use(cors());

// 1) Llama-Funktion (ruft Ollama-API auf)
async function llamaLLM(prompt) {
const systemPrompt = `
You are an educational assistant that transforms user input into
clear, explanatory PlantUML diagrams or models. Your goal is to teach
and illustrate concepts, not just produce syntax.

– Use @startuml…@enduml blocks only.
– Include meaningful labels, stereotypes or notes to explain each element.
– Show relationships, flows or hierarchies in a way that aids understanding.
– Avoid any text outside the PlantUML block.

When given facts or a scenario, produce a self-contained diagram that
visually explains how the parts fit together.
`.trim();


  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: LLAMA_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: prompt }
      ]
    })
  });
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${await response.text()}`);
  }
  const { choices } = await response.json();
  return choices[0].message.content.trim();
}

// 2) PlantUML-Renderer (Java-JAR via stdin/stdout)
async function renderPlantUML(umlText) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'java',
      ['-jar', '/usr/local/bin/plantuml.jar', '-pipe', '-tpng'],
      { stdio: ['pipe', 'pipe', 'inherit'] }
    );

    const chunks = [];
    proc.stdout.on('data', (b) => chunks.push(b));
    proc.on('close', (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`PlantUML exited with code ${code}`));
    });

    proc.stdin.write(umlText);
    proc.stdin.end();
  });
}
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt must be a non-empty string.' });

  let plantUMLText;
  try {
    plantUMLText = await llamaLLM(prompt);
    console.log('Generated PlantUML:', plantUMLText);
  } catch (err) {
    console.error('LLM error', err);
    return res.status(500).json({ error: 'LLM error: '+err.message });
  }

  try {
    const pngBuffer = await renderPlantUML(plantUMLText);
    return res.json({
      success: true,
      plantuml: plantUMLText,
      imageBase64: pngBuffer.toString('base64')
    });
  } catch (err) {
    console.error('Render error', err);
    // 200 damit Frontend die plantUML-Ausgabe bekommt
    return res.json({
      success: false,
      plantuml: plantUMLText,
      error: 'Render error: '+err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
