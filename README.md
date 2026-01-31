# ClawdBot PWA (Jenny AI) ✨

A high-performance, premium AI companion web application built with **SolidJS**, **Bun**, and **Lightning CSS**. Jenny is designed to be a sleek interface for the [Clawdbot](https://github.com/clawdbot/clawdbot) ecosystem.

![Banner](https://raw.githubusercontent.com/Ninja91/ClawdBot-PWA/main/public/icons/icon-512.png)

## 🚀 Key Features

- 💎 **Deep Glassmorphism**: High-fidelity blurred interfaces with saturated backdrops.
- 📊 **Rich Visualization**: In-line rendering of Bar, Line, Pie, and Radar charts using Chart.js.
- 📝 **Advanced Markdown**: Full GFM support including Zebra-striped tables and code highlighting.
- 🎙️ **Voice Mode**: Native Web Speech API integration with live waveform animations.
- ⚡ **Ultra-Fast**: Powered by Bun runtime and Lightning CSS for sub-second builds.
- 📱 **PWA Ready**: Installable on iOS, Android, and Desktop as a standalone application.
- 🔒 **Secure Connection**: Real-time diagnostics for your Clawdbot Gateway status.

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Frontend**: [SolidJS](https://www.solidjs.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Lightning CSS](https://lightningcss.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Components**: [shadcn-solid](https://shadcn-solid.com/) + [Kobalte](https://kobalte.dev/)
- **API**: Clawdbot OpenAI-compatible Gateway

## 📂 Project Structure

```text
src/
├── components/
│   ├── chat/        # ChatView, Markdown, Charts
│   ├── layout/      # Sidebar, SettingsView, Nav
│   └── ui/          # Atomic components (Button, Avatar, etc.)
├── hooks/           # Custom hooks (useSpeech, etc.)
├── lib/             # API client and core utilities
├── store/           # Global state using SolidJS Stores
├── styles/          # Global styles and Tailwind config
└── types/           # Shared TypeScript interfaces
```

## ⚙️ Setup & Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Ninja91/ClawdBot-PWA.git
   cd ClawdBot-PWA
   ```

2. **Install Dependencies**
   ```bash
   bun install
   ```

3. **Start Development Server**
   ```bash
   bun dev
   ```

4. **Connect Gateway**
   Ensure your Clawdbot Gateway is running locally on port `18789`.

## 🤝 Contribution

Feel free to open issues or pull requests to improve the UX or add new visualization components.

---

*Made with ✨ by Nitin Jain*
