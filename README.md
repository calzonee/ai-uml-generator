# Projektbeschreibung: ai-uml-generator

## Ziel

Der **ai-uml-generator** ist ein Tool zur automatischen Generierung von UML-Diagrammen auf Basis natürlicher Sprache oder Quellcode. Die Verarbeitung erfolgt durch ein lokal installiertes Large Language Model (LLM), z. B. **LLaMA**, das die Eingabe analysiert und daraus UML-Beschreibungen in **PlantUML**-Syntax erzeugt. Die finale Diagrammausgabe erfolgt über einen lokal eingebundenen **PlantUML-Service** als PNG-Grafik.

## Architektur

Das System besteht aus modularen Services:
- **Input-Service**: Nimmt Benutzereingaben entgegen (Text oder Code)
- **LLM-Service**: Verarbeitet die Eingabe lokal mit LLaMA und generiert PlantUML-Syntax
- **PlantUML-Service**: Wandelt die PlantUML-Beschreibung in ein PNG-Diagramm um

## Merkmale

- Unterstützung natürlicher Sprache und (zukünftig) Quellcode
- Generierung von UML-Diagrammen, z. B.:
  - Klassendiagramme
  - Sequenzdiagramme
  - Aktivitätsdiagramme (optional)
- Ausgabeformat: PlantUML (Text) + PNG
- Lokale Ausführung aller Dienste (Datensicherheit, Offline-Fähigkeit)
- Erweiterbar durch zusätzliche Services oder Diagrammtypen

## Zielgruppe

- Softwareentwickler:innen
- Architekt:innen
- Studierende und Lehrende in der Informatik

## Motivation

UML-Diagramme helfen bei der Dokumentation und Planung von Softwarearchitektur. Durch den Einsatz von KI und lokalen Tools wird dieser Prozess beschleunigt, vereinfacht und unabhängig von Drittanbietern realisiert.

