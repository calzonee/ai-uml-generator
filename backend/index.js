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
You are an assistant that transforms user prompts into valid PlantUML diagrams.
Respond with PlantUML only (between @startuml and @enduml), no extra text.
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
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt must be a non-empty string.' });
    }

    // 1) Diagramm-Text von Llama holen
    const plantUMLText = await llamaLLM(prompt);
    console.log('Generated PlantUML:', plantUMLText);
    // 2) Diagramm als PNG rendern
    const pngBuffer = await renderPlantUML(plantUMLText);

    // 3) PNG als Base64 in JSON zurückgeben
    res.json({
      "success": true,
      plantuml: plantUMLText,
      imageBase64: pngBuffer.toString('base64')
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
