const express = require('express');
const bodyParser = require('body-parser');
const plantumlEncoder = require('plantuml-encoder');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Dummy LLM: wandelt Prompt in PlantUML Text um (minimales Klassendiagramm)
function dummyLLM(prompt) {
  const sanitized = prompt.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  return `
@startuml
class ${sanitized} {
}
@enduml
  `.trim();
}

// PlantUML Server URL Builder (PNG)
function getPlantUMLImageURL(plantumlText) {
  const encoded = plantumlEncoder.encode(plantumlText);
  return `http://www.plantuml.com/plantuml/png/${encoded}`;
}

app.post('/api/generate', (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    res.status(400).json({ error: 'Prompt is required and must be a non-empty string.' });
    return;
  }

  const plantUMLText = dummyLLM(prompt);
  const imageUrl = getPlantUMLImageURL(plantUMLText);

  res.json({
    plantuml: plantUMLText,
    imageUrl,
  });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});