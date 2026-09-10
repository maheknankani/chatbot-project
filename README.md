# NovaAI - AI Copilot Platform



**NovaAI** is a high-performance web dashboard and interactive AI Copilot interface powered by Google Gemini 3.6 Flash & OpenAI APIs. It features real-time interactive analytics graphs, sleek Google Material Symbols iconography, dark/light theme engines, and zero-dependency frontend architecture.

---

## Highlights & Key Features

- **Real-Time Interactive Graphs**:
  - **System Performance & Throughput Chart**: Dual-axis line graph with linear gradients tracking API requests & latency with interactive time range filters (`1H`, `24H`, `7D`, `30D`).
  - **Live Mini Sparkline Chart**: Dynamic response latency canvas update.
  - **Analytics Breakdown**: Daily Token Consumption Bar Chart and Request Distribution Doughnut Chart powered by `Chart.js`.
- **Modern Iconography**: Beautiful Google Material Symbols (`science`, `code`, `lightbulb`, `mail`, `travel_explore`, `terminal`, `palette`, `description`) with glassmorphism gradient containers.
- **Expandable AI Copilot Widget**: Floating chat assistant with real-time stream simulation, animated typing indicators, response copy buttons, and chat clearing.
- **Multi-Model Engine**: Switch dynamically between `Gemini 3.6 Flash`, `Gemini 2.5 Flash`, and `GPT-4o Mini`.
- **Quick Starter Templates**: One-click prompt launchers for Science, Coding, Business Strategy, and Work emails.
- **Plugin & Extension Toggles**: Interactive controls for Web Search Surfer, Code Interpreter, Image Generator, and Document Summarizer.
- **Custom System Settings**: Easily update API keys, customize system instruction personas, adjust model creativity (temperature sliders), and switch response languages.
- **Theme Engine**: Seamless toggle between Dark and Light themes with dynamic chart color adjustment.

---

## Tech Stack & Dependencies

- **Frontend Core**: Standard HTML5, CSS3 (CSS Custom Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES6+)
- **Interactive Visualizations**: [Chart.js (v4.x)](https://www.chartjs.org/) via CDN
- **Typography & Icons**: Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*) & [Google Material Symbols](https://fonts.google.com/icons)
- **AI Integrations**:
  - Google Gemini REST API (`generativelanguage.googleapis.com`)
  - OpenAI Chat Completions API (`api.openai.com`)

---

## Getting Started



1. **Launch the App**:
   - Simply open `index.html` in any modern web browser (no `npm install` or local server required).

2. **Set Up Your API Key**:
   - Go to **Settings** in the sidebar.
   - Enter your **Google Gemini Key** (`AIza...` / `AQ...`) or **OpenAI Key** (`sk-...`).
   - Click **Save Key**.


