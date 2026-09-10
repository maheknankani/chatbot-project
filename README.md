# 🚀 NovaAI - Workflow Engine & AI Copilot Platform

![NovaAI Status](https://img.shields.io/badge/NovaAI-v2.5_Active-7c3aed?style=for-the-badge&logo=ai)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![Google Material Symbols](https://img.shields.io/badge/Material_Symbols-4285F4?style=for-the-badge&logo=google&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**NovaAI** is a high-performance web dashboard and interactive AI Copilot interface powered by Google Gemini 3.6 Flash & OpenAI APIs. It features real-time interactive analytics graphs, sleek Google Material Symbols iconography, dark/light theme engines, and zero-dependency frontend architecture.

---

## ✨ Highlights & Key Features

- 📊 **Real-Time Interactive Graphs**:
  - **System Performance & Throughput Chart**: Dual-axis line graph with linear gradients tracking API requests & latency with interactive time range filters (`1H`, `24H`, `7D`, `30D`).
  - **Live Mini Sparkline Chart**: Dynamic response latency canvas update.
  - **Analytics Breakdown**: Daily Token Consumption Bar Chart and Request Distribution Doughnut Chart powered by `Chart.js`.
- 🎨 **Modern Iconography**: Beautiful Google Material Symbols (`science`, `code`, `lightbulb`, `mail`, `travel_explore`, `terminal`, `palette`, `description`) with glassmorphism gradient containers.
- 🤖 **Expandable AI Copilot Widget**: Floating chat assistant with real-time stream simulation, animated typing indicators, response copy buttons, and chat clearing.
- ⚡ **Multi-Model Engine**: Switch dynamically between `Gemini 3.6 Flash`, `Gemini 2.5 Flash`, and `GPT-4o Mini`.
- 💡 **Quick Starter Templates**: One-click prompt launchers for Science, Coding, Business Strategy, and Work emails.
- 🔌 **Plugin & Extension Toggles**: Interactive controls for Web Search Surfer, Code Interpreter, Image Generator, and Document Summarizer.
- ⚙️ **Custom System Settings**: Easily update API keys, customize system instruction personas, adjust model creativity (temperature sliders), and switch response languages.
- 🌙 **Theme Engine**: Seamless toggle between Dark and Light themes with dynamic chart color adjustment.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Core**: Standard HTML5, CSS3 (CSS Custom Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES6+)
- **Interactive Visualizations**: [Chart.js (v4.x)](https://www.chartjs.org/) via CDN
- **Typography & Icons**: Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*) & [Google Material Symbols](https://fonts.google.com/icons)
- **AI Integrations**:
  - Google Gemini REST API (`generativelanguage.googleapis.com`)
  - OpenAI Chat Completions API (`api.openai.com`)

---

## 📂 Repository Structure

```
chatbot-project/
├── index.html        # Main dashboard structure, views, & chart canvas containers
├── style.css         # Glassmorphism UI, themes, chart cards & icon box styles
├── script.js         # Core app logic, Chart.js initializations, & API handlers
└── README.md         # Documentation & project overview
```

---

## 🚀 Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/maheknankani/chatbot-project.git
   cd chatbot-project
   ```

2. **Launch the App**:
   - Simply open `index.html` in any modern web browser (no `npm install` or local server required).

3. **Set Up Your API Key**:
   - Go to **Settings** in the sidebar.
   - Enter your **Google Gemini Key** (`AIza...` / `AQ...`) or **OpenAI Key** (`sk-...`).
   - Click **Save Key**.

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
