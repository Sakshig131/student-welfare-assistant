# Student Welfare Assistant 🎓

> **Your campus support, all in one place.**  
> A modern, responsive college student support dashboard and chatbot frontend built with HTML5, CSS3, and vanilla JavaScript.

---

## 📌 Project Overview

**Student Welfare Assistant** is an accessible web dashboard designed to assist college students with everyday institutional navigation—such as finding scholarship application guidance, understanding attendance rules, handling fee installment requests, accessing hostel and library services, seeking mental wellbeing resources, and knowing official anti-ragging grievance procedures.

This prototype includes a **clearly labelled rule-based demo engine** on the frontend and is architected to be **backend-ready**, allowing seamless integration with a production AI model (e.g., Google Gemini, OpenAI, Anthropic, or open-source LLMs) via a secure backend proxy.

---

## 🚀 Key Features

1. **Modern College Dashboard:**
   - Academic blue-and-white theme with high contrast and accessible typography.
   - Clean card-based design with rounded borders and responsive layouts for desktop, tablet, and mobile devices.
2. **Interactive Chat Assistant:**
   - Message history with distinct visual bubbles for user and assistant.
   - Animated typing indicator mimicking live response generation.
   - Support for both the "Send" button and the `Enter` keyboard key.
   - Input validation with user-friendly warnings for blank submissions.
   - Reset/clear conversation functionality.
3. **Quick-Action Support Topics:**
   - One-click access to sample guidance across six key welfare areas:
     - 🎓 **Scholarships** (merit & need-based financial awards)
     - 📝 **Attendance & Exams** (criteria, hall tickets, medical leaves)
     - 💳 **Fees & Financial Aid** (installments, fee receipts, loan documents)
     - 🏢 **Hostel & Library** (amenities, curfew rules, book loans)
     - 💚 **Mental Wellbeing** (confidential counseling, stress management)
     - 🛡️ **Grievances & Anti-Ragging** (Internal Complaints Committee & UGC compliance)
4. **Safety & Institutional Disclaimers:**
   - Prominent, high-priority emergency banner at the top of the interface:
     > *"For emergencies or immediate danger, contact local emergency services or your college authorities."*
   - Every assistant response is marked with a `[DEMO RESPONSE]` pill and reminders to verify official dates, eligibility criteria, and forms with college administrative offices.
5. **Decoupled Backend-Ready Architecture:**
   - Isolated `ChatService` abstraction layer.
   - Zero frontend API keys or security leaks.
   - Switch between local demo mode and real backend with a single config flag.

---

## 📂 Project Structure

```text
student-welfare-assistant/
│
├── index.html        # Semantic HTML5 dashboard layout and chat UI
├── style.css         # CSS3 styling, responsive grid, animations, and blue theme
├── script.js         # Frontend controller, input validation, and decoupled ChatService
└── README.md         # Documentation, run instructions, and backend guide
```

---

## 🏃 How to Run the Project Locally

No build tools, compilation steps, or complex dependencies are needed. You can run the project in any modern web browser using any of the methods below:

### Option 1: Direct File Launch (Easiest)
1. Open the project folder in your file explorer:
   `c:\Users\saksh\OneDrive\Desktop\student-welfare-assistant`
2. Double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Using VS Code Live Server
1. Open the folder in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The site will open automatically at `http://127.0.0.1:5500`.

### Option 3: Using Python Built-in HTTP Server
If you have Python installed on your system, open a terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option 4: Using Node.js `npx serve`
If you have Node.js installed, open a terminal in the project folder and run:
```bash
npx serve .
```

---

## ⚠️ Demo Mode vs. Real AI Integration

### What is Currently Running?
* The current frontend runs a **rule-based simulation** (`CONFIG.USE_MOCK_BACKEND = true`).
* It maps user queries to curated sample advice for common student scenarios.
* **No fake claims:** The assistant explicitly labels responses with `[Demo Response]` and clarifies that official dates, scholarship amounts, attendance thresholds, and forms must be confirmed with your specific institution.

### Why Are API Keys Kept Out of Frontend Code?
* Exposing private API keys (such as OpenAI or Google Gemini keys) in browser JavaScript code allows anyone viewing the page's source code or network tab to steal your key and rack up unauthorized charges.
* Real production AI applications always route chat requests through a secure server (Node.js/Express, Python/FastAPI, Flask, etc.) where API keys are securely stored in environment variables (`.env`).

---

## 🔌 Connecting a Real AI Backend

When you are ready to connect a real Large Language Model (LLM) or college knowledge base, follow these steps:

### Step 1: Set Up a Secure Backend Server (Example with Node.js & Express)

Create a lightweight backend server (e.g., `server.js`):

```javascript
// Example Node.js / Express backend server (server.js)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Your private API key is safely stored in environment variables (.env)
const AI_API_KEY = process.env.AI_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Call your preferred AI Provider (e.g., Google Gemini, OpenAI, Claude, or local Ollama)
    // Example: Forward message with a system prompt grounding answers to college welfare
    const aiResponse = `Here is official assistance for your query: "${message}"...`;

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.listen(3000, () => console.log('Welfare Assistant API running on port 3000'));
```

### Step 2: Update `script.js` Configuration

In `script.js`, change the configuration settings at the top of the file:

```javascript
const CONFIG = {
  // Set to false to activate live backend calls
  USE_MOCK_BACKEND: false,

  // Point to your backend endpoint (or full URL like 'http://localhost:3000/api/chat')
  BACKEND_API_URL: 'http://localhost:3000/api/chat',

  // ...
};
```

The rest of the user interface—message rendering, input validation, typing animations, and topic buttons—will immediately work with your live AI backend without any UI rewrites!

---

## ♿ Accessibility & UX Highlights

* **Accessible Contrast:** Text colors strictly meet WCAG AA contrast standards.
* **Keyboard Navigation:** Full support for `Tab` focusing with visible focus rings, and `Enter` key form submissions.
* **Semantic HTML:** Utilizes `<header>`, `<main>`, `<section>`, `<aside>`, `<form>`, and ARIA attributes (`role="alert"`, `aria-live="polite"`).
* **Mobile-First Responsiveness:** Breakpoints at 960px and 640px allow fluid adaptation from wide desktop monitors to mobile phones.

---

## 📄 License & Attribution

This project is created for educational and college demonstration purposes. You are welcome to adapt, customize, and extend it for your college or university's student welfare department.
