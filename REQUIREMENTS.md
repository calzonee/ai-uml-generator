# Problem
Der rasante Aufstieg der künstlichen Intelligenz (KI) geht mit einem steigenden Ressourcenverbrauch einher und wirft zunehmend Fragen zur ökologischen Nachhaltigkeit auf. Während Investitionen in KI-Technologien stetig zunehmen, wächst auch die Sorge über ihren ökologischen Fußabdruck – insbesondere im Hinblick auf Energieverbrauch, benötigte Rechenleistung und Hardwareeinsatz.
Als besonders ressorcenintensiv stellt sich die Bildgenerierung heraus, die einen hohen Stromverbrauch und oft hohe Hardwareanforderungen verzeichnen, wodurch hohe Latenzzeiten zu erwarten sind. Falls ein User nicht zufrieden mit dem generierten Bild ist, bleibt oft keine andere Möglichkeit, als erneut einen Prompt zu formulieren, erneut einen ressourcenintensiven Prozess zu starten und wieder zu warten.

# Lösungsansatz und Idee
Im Spektrum der künstlichen Intelligenz werden LLMs (Large Language Models) in der Generierung von Text eingesetzt. Auf der Basis von wissenschaftlichen Daten und Bücher bieten diese Modelle ein großes Potenzial, Ressourcen und Zeit einzusparen, indem sie Bilder indirekt generieren. Diese indirekte Eigenschaft ermöglicht es Usern, auch unabhängig von Prompts Bilder zu bearbeiten. Ein solches System wäre außerdem in der Lage, vergleichsweise wenig Strom zu verbrauchen und auf CPUs zu laufen, was die Notwendigkeit teurer GPUs nehmen würde.

# Beschreibung
Ziel des Projekts ist die Entwicklung einer webbasierten Anwendung, die es User erlaubt, mit natürlicher Sprache (Prompts) automatisiert UML-Diagramme zu erstellen. Die Eingabe wird in ein strukturiertes Textformat überführt und mittels PlantUML in ein Diagram (PNG) gewandelt. Das System setzt auf eine modulare Architektur, um verschiedene Web-Services und LLMs integrieren und testen zu können. Nachhaltigkeit (Green Coding), Erweiterbarkeit und eine einfache Nutzung werden bei der Entwicklung bedeutend sein.

# Ziele und Nicht-Ziele
**Ziele:**
- Visualisierung technischer Konzepte durch natürliche Spracheingaben als UML-Diagramm
- generierung des Diagramms mittels plantUML
- Unterstützung verschiedener LLMs (austauschbar/testbar)
-> Einbindung verschiedener IT-Services
- Bereitstellung als einfach bedienbare Webanwendung
- Auswahl verschiedener Formate (PNG, SVG)
- Green Coding und nachhaltige Architektur (ressourceneffizient/modular)

**Nicht-Ziele:**
- Kein umfassendes Projektmanagement-Tool
- Kein User-Management (optional geplant)
- Kein Fokus auf komplexe Authentifizierung

# Zielgruppe
- Software Engineers, DevOps Engineers, Entwickler:innen
- Studierende Informatiker:innen
- angehende Software-Architekt:innen
- Personen die schnell ein **visuelles Modell** aus Text generieren möchten
**Anforderungen:**
- Einfache Bedienung (intuitiv)
- Schnelle Ergebnisse
- Möglichkeit zur Weiterverwendung und Teilbarkeit

# Tech-Stack
**Frontend:**
- Vue.js (Composition API)
- Vite für Buildprozess

**Backend:**
- Node.js, Express.js
- REST-API (axios)
- plantUML 
- LLaMa, OpenAI, Mistral, DeepSeek (fine-tuned)

**DevOps/ Infrastruktur:**
- Docker
- GitHub (CI/CD)
- Redis (optional Caching)
- ggf. Hash-Links zum Teilen

# Funktionale Anforderungen
| Beschreibung                                                       | Priorität |
| ------------------------------------------------------------------ | --------- |
| Prompteingabe generiert UML-Diagramm                               | hoch      |
| LLM erzeugt Ausgabe in strukturierter PlantUML-Syntax              | hoch      |
| Text wird zu PlantUML geparst, Bildgenerierung                     | hoch      |
| Anzeige und Download des Diagramms                                 | hoch      |
| Auswahl verschiedener LLMs (zum testen)                            | mittel    |
| Teilbarer Link                                                     | mittel    |
| Möglichkeit zur Bearbeitung des generierten Textes vor dem Rendern | mittel    |
| Oberfläche um modular verschiedene LLMs zu testen                  | niedrig   |
| Authentifzierungs- und Login Service                               | niedrig   |

# Nicht-Funktionale Anforderungen
| Beschreibung                                             | Prio    |
| -------------------------------------------------------- | ------- |
| Modularität im Backend                                   | hoch    |
| Green Coding: Ressorcenschonende Architektur und Modelle | hoch    |
| Responsive Barrierearme UI                               | mittel  |
| Dockerisierte Umgebung für einfache Bereitstellung       | mittel  |
| Gute Dokumentation für Open-Source                       | mittel  |
| Besonders kurze Antwortzeiten                            | niedrig |
| Skalierbarkeit und Load Balancing                        | niedrig |

# Use Cases

# Stakeholder

# Zeitlicher Rahmen
Gesamtzeit: 3-4 Monate
Phase 1: Definition & Anforderungsanalyse (2 Wochen)
Phase 2: Grundfunktionalitäten, UML-Editor, Prompt UI (2 Wochen)
Phase 3: LLM Integration, Fine Tuning (2-4 Wochen)
Phase 4: UI & UX + Tests (2 Wochen)
Phase 5: Nachhaltigkeitsoptimierung, Doku (Restzeit)