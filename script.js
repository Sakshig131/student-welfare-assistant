/**
 * ============================================================================
 * Student Welfare Assistant - Frontend Logic & Architecture
 * ============================================================================
 * 
 * This application is organized into 4 distinct layers:
 *  1. CONFIGURATION: Environment toggles and backend endpoint settings.
 *  2. DEMO KNOWLEDGE ENGINE: Keyword and intent matching for college queries.
 *  3. CHAT SERVICE ABSTRACTION: Decoupled service layer ready for real AI backends.
 *  4. UI CONTROLLER: DOM manipulation, event listeners, input validation, and rendering.
 * 
 * IMPORTANT ARCHITECTURE NOTE:
 * Do not put private API keys (OpenAI, Gemini, Claude, etc.) in frontend code.
 * When integrating a real AI model, switch CONFIG.USE_MOCK_BACKEND to false and
 * route requests through a secure server (e.g. Node.js, Python FastAPI/Flask).
 */

// ============================================================================
// 1. CONFIGURATION
// ============================================================================
const CONFIG = {
  // Toggle this to false when connecting to a real backend server
  USE_MOCK_BACKEND: true,

  // Backend API endpoint for when a real server is running
  BACKEND_API_URL: '/api/chat',

  // Simulated response latency in milliseconds to demo typing indicators
  SIMULATED_LATENCY_MS: 650,

  // Welcome message displayed when conversation initializes
  WELCOME_MESSAGE: {
    text: `Hello! 👋 Welcome to the **Student Welfare Assistant**.\n\nI am a campus support prototype designed to guide you through common college questions, including:\n* **Scholarships & Financial Aid**\n* **Attendance & Examination Regulations**\n* **Fee Installments & Receipts**\n* **Hostel Amenities & Library Services**\n* **Mental Health & Campus Counseling**\n* **Grievance Redressal & Anti-Ragging Policies**\n\nHow can I help you today? You can type your question below or click any of the quick support topics on the left.`,
    isDemo: true
  }
};


// ============================================================================
// 2. DEMO KNOWLEDGE ENGINE (Rule-Based Fallback)
// ============================================================================
/**
 * Note: These responses are clearly marked sample templates.
 * In a production system, accurate dates, eligibility rules, and forms
 * should come directly from your college's database or official AI assistant.
 */
const DEMO_RESPONSES = {
  scholarships: {
    title: "Scholarships & Financial Support Guidance",
    text: `Here is general guidance regarding college scholarships:\n\n` +
          `1. **Categories Available:** Most institutions offer Merit-Based Scholarships, Need-Based/Fee Waivers, Sports/Cultural Quotas, and National/State Government Welfare Schemes.\n` +
          `2. **General Documents Typically Required:**\n` +
          `   - Previous semester/academic mark sheets\n` +
          `   - Official family income certificate\n` +
          `   - Valid student identification and fee receipt\n` +
          `   - Bank account passbook copy in the student's name\n` +
          `3. **Recommended Next Steps:** Check your college's official scholarship portal or visit the Student Welfare/Dean's Office to obtain exact application deadlines and eligibility forms.`
  },

  "attendance-exams": {
    title: "Attendance & Examination Policies",
    text: `Here is general guidance regarding academic attendance and examinations:\n\n` +
          `1. **Minimum Attendance Criteria:** Most regulatory bodies require a minimum of 75% attendance to qualify for semester examinations.\n` +
          `2. **Medical & Extenuating Circumstances:** If your attendance fell below criteria due to illness or personal emergency, submit medical certificates or formal documentation to your Head of Department (HOD) as early as possible.\n` +
          `3. **Hall Tickets & Admit Cards:** Examination admit cards are usually released 1 to 2 weeks before exams via the student ERP portal after clearance of all dues.\n` +
          `4. **Official Verification:** Refer to your university academic handbook or consult your faculty advisor for department-specific criteria.`
  },

  "fees-aid": {
    title: "Fees, Installments & Financial Aid",
    text: `Here is general guidance for college fee queries:\n\n` +
          `1. **Payment Receipts:** Official fee receipts are normally downloadable from your college ERP or student accounts dashboard upon bank reconciliation.\n` +
          `2. **Installment Facilities:** Many universities offer installment options or delayed payment requests for students experiencing financial hardship upon submitting a formal application to the Registrar or Accounts Office.\n` +
          `3. **Education Loans:** The college administration can issue an official Fee Structure Certificate and Bonafide Certificate required by banking institutions.\n` +
          `4. **Action:** Please visit your college Accounts/Finance department for exact fee schedules and payment verification.`
  },

  "hostel-library": {
    title: "Hostel Facilities & Library Services",
    text: `Here is general information on campus accommodation and library facilities:\n\n` +
          `1. **Hostel Administration:** Room maintenance, room allocation, curfew extension permissions, and mess rebates are typically handled by the Chief Warden's office or hostel supervisor.\n` +
          `2. **Library Circulation:** Your student ID card generally serves as your library card for borrowing books. Standard loan limits are usually 2 to 4 books for undergraduate/graduate students.\n` +
          `3. **Digital Repositories:** Most college libraries provide remote credentials for online journal databases (e.g., IEEE, JSTOR, Springer).\n` +
          `4. **Action:** For specific hostel room allocations or book reservation procedures, reach out to your Hostel Warden or Central Library helpdesk.`
  },

  "mental-wellbeing": {
    title: "Mental Wellbeing & Counseling Support",
    text: `Your mental health and emotional well-being are paramount.\n\n` +
          `1. **Campus Counseling Services:** Most colleges provide free, confidential one-on-one sessions with professional counselors or clinical psychologists.\n` +
          `2. **Common Support Topics:** Academic stress, exam anxiety, loneliness, relationship challenges, and adjusting to campus life.\n` +
          `3. **Confidentiality:** Campus counseling centers maintain strict student confidentiality and do not share notes with academic staff.\n` +
          `4. **Urgent Need:** If you or someone you know is in acute distress, please contact your university health center or call your local national mental health helpline immediately.`
  },

  grievances: {
    title: "Grievance Redressal & Anti-Ragging Policies",
    text: `Campus safety, dignity, and anti-harassment regulations:\n\n` +
          `1. **Zero Tolerance for Ragging:** Colleges maintain a strict zero-tolerance policy against any form of ragging, bullying, or intimidation. Ragging is a punishable legal offense.\n` +
          `2. **Internal Complaints Committee (ICC):** For cases of harassment or discrimination, you have the right to file a formal, confidential complaint with the college's Internal Complaints Committee.\n` +
          `3. **Grievance Portals:** General academic or infrastructure complaints can be submitted via the college's official online grievance redressal cell or designated ombudsman.\n` +
          `4. **Immediate Concern:** Report any safety violation directly to the Anti-Ragging Squad or campus security without delay.`
  }
};

/**
 * Match user query against common keywords to find appropriate demo response.
 * @param {string} rawQuery 
 * @returns {object} Formatted response object with demo disclaimer flag.
 */
function matchDemoIntent(rawQuery) {
  const query = rawQuery.toLowerCase();

  // Keyword mappings for demo matcher
  if (query.includes('scholarship') || query.includes('financial aid') || query.includes('stipend') || query.includes('grant')) {
    return {
      text: DEMO_RESPONSES.scholarships.text,
      isDemo: true
    };
  }

  if (query.includes('attendance') || query.includes('exam') || query.includes('hall ticket') || query.includes('admit card') || query.includes('marks') || query.includes('percentage')) {
    return {
      text: DEMO_RESPONSES["attendance-exams"].text,
      isDemo: true
    };
  }

  if (query.includes('fee') || query.includes('tuition') || query.includes('installment') || query.includes('dues') || query.includes('receipt') || query.includes('challan')) {
    return {
      text: DEMO_RESPONSES["fees-aid"].text,
      isDemo: true
    };
  }

  if (query.includes('hostel') || query.includes('room') || query.includes('mess') || query.includes('library') || query.includes('book') || query.includes('curfew')) {
    return {
      text: DEMO_RESPONSES["hostel-library"].text,
      isDemo: true
    };
  }

  if (query.includes('mental') || query.includes('stress') || query.includes('counsel') || query.includes('anxiety') || query.includes('depress') || query.includes('wellbeing') || query.includes('wellness')) {
    return {
      text: DEMO_RESPONSES["mental-wellbeing"].text,
      isDemo: true
    };
  }

  if (query.includes('ragging') || query.includes('bully') || query.includes('harass') || query.includes('complaint') || query.includes('grievance') || query.includes('icc')) {
    return {
      text: DEMO_RESPONSES.grievances.text,
      isDemo: true
    };
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('morning') || query.includes('evening')) {
    return {
      text: `Hello there! 👋 I am your **Student Welfare Assistant**.\n\nYou can ask me about scholarships, attendance rules, fee procedures, hostel/library amenities, counseling services, or anti-ragging support. You can also pick any of the quick buttons on the left!`,
      isDemo: true
    };
  }

  // Fallback response for unmapped queries
  return {
    text: `Thank you for your question. As this is a **prototype demo**, I am currently configured with sample guidance on six core welfare areas:\n\n` +
          `* **Scholarships** (merit & need-based funding)\n` +
          `* **Attendance & Exams** (regulations and leave policies)\n` +
          `* **Fees & Financial Aid** (payment structures & installments)\n` +
          `* **Hostel & Library** (campus facilities & borrowing guidelines)\n` +
          `* **Mental Wellbeing** (counseling & stress management)\n` +
          `* **Grievances & Anti-Ragging** (student rights & dispute redressal)\n\n` +
          `Please select one of the topics from the sidebar or phrase your question around these topics. For specific official college policies, please contact your university administration directly.`,
    isDemo: true
  };
}


// ============================================================================
// 3. CHAT SERVICE ABSTRACTION (Backend-Ready Architecture)
// ============================================================================
/**
 * ChatService abstracts away where the AI response comes from.
 * 
 * In Demo Mode:
 *  - Uses matchDemoIntent with an artificial delay.
 * 
 * In Production Backend Mode:
 *  - Issues a POST request to your secure backend (e.g., /api/chat).
 *  - The backend server safely stores AI API keys and proxies requests to models.
 */
class ChatService {
  /**
   * Send a user message and receive an assistant reply.
   * @param {string} userMessage 
   * @returns {Promise<{text: string, isDemo: boolean}>}
   */
  static async sendMessage(userMessage) {
    if (CONFIG.USE_MOCK_BACKEND) {
      // Simulate network latency so typing indicators can be experienced
      return new Promise((resolve) => {
        setTimeout(() => {
          const response = matchDemoIntent(userMessage);
          resolve(response);
        }, CONFIG.SIMULATED_LATENCY_MS);
      });
    } else {
      // REAL BACKEND INTEGRATION PATH:
      // Replace or configure this block when your backend server is deployed.
      try {
        const response = await fetch(CONFIG.BACKEND_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();
        return {
          text: data.reply || "Sorry, no reply was returned by the server.",
          isDemo: false
        };
      } catch (error) {
        console.error("Backend request failed:", error);
        return {
          text: `⚠️ **Connection Error:** Could not reach the backend service at \`${CONFIG.BACKEND_API_URL}\`.\n\nPlease check your server connection or switch back to \`CONFIG.USE_MOCK_BACKEND = true\` in \`script.js\`.`,
          isDemo: false
        };
      }
    }
  }

  /**
   * Fetch topic-specific sample response directly.
   * @param {string} topicKey 
   * @returns {Promise<{text: string, isDemo: boolean}>}
   */
  static async getTopicResponse(topicKey) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topicData = DEMO_RESPONSES[topicKey];
        if (topicData) {
          resolve({
            text: topicData.text,
            isDemo: true
          });
        } else {
          resolve(matchDemoIntent(topicKey));
        }
      }, CONFIG.SIMULATED_LATENCY_MS);
    });
  }
}


// ============================================================================
// 4. UI CONTROLLER (DOM Interactions & State Management)
// ============================================================================
class WelfareUI {
  constructor() {
    // DOM Elements
    this.chatMessages = document.getElementById('chat-messages');
    this.chatForm = document.getElementById('chat-form');
    this.userInput = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.typingIndicator = document.getElementById('typing-indicator');
    this.inputAlert = document.getElementById('input-alert');
    this.resetBtn = document.getElementById('reset-chat-btn');
    this.topicButtons = document.querySelectorAll('.topic-btn');
    this.promptChips = document.querySelectorAll('.prompt-chip');

    this.isProcessing = false;

    this.bindEvents();
    this.initWelcomeMessage();
  }

  /**
   * Register all event listeners for buttons, form, and keys.
   */
  bindEvents() {
    // Form submission (click Send or press Enter)
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Clear alert message on input typing
    this.userInput.addEventListener('input', () => {
      this.hideAlert();
    });

    // Reset chat button
    this.resetBtn.addEventListener('click', () => {
      this.resetChat();
    });

    // Quick Action sidebar buttons
    this.topicButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const topicKey = btn.getAttribute('data-topic');
        const topicName = btn.querySelector('.topic-name')?.textContent || topicKey;
        this.handleTopicSelect(topicKey, topicName);
      });
    });

    // Suggestion chips under the chatbox
    this.promptChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const promptText = chip.getAttribute('data-prompt') || chip.textContent;
        this.userInput.value = promptText;
        this.handleFormSubmit();
      });
    });
  }

  /**
   * Display initial welcome message on load or reset.
   */
  initWelcomeMessage() {
    this.chatMessages.innerHTML = '';
    this.renderMessage({
      sender: 'bot',
      text: CONFIG.WELCOME_MESSAGE.text,
      isDemo: CONFIG.WELCOME_MESSAGE.isDemo,
      timestamp: this.getCurrentTimeString()
    });
  }

  /**
   * Reset the chat back to original initial state.
   */
  resetChat() {
    if (confirm("Would you like to reset the chat conversation?")) {
      this.initWelcomeMessage();
      this.hideAlert();
      this.userInput.value = '';
      this.userInput.focus();
    }
  }

  /**
   * Validate user input and display friendly feedback if empty.
   * @param {string} text 
   * @returns {boolean}
   */
  validateInput(text) {
    if (!text || text.trim().length === 0) {
      this.showAlert("Please enter a question or choose one of the quick topics.");
      this.userInput.focus();
      return false;
    }

    if (text.trim().length > 500) {
      this.showAlert("Message is too long. Please keep queries under 500 characters.");
      return false;
    }

    this.hideAlert();
    return true;
  }

  /**
   * Display inline validation warning message.
   * @param {string} msg 
   */
  showAlert(msg) {
    this.inputAlert.textContent = msg;
    this.inputAlert.classList.remove('hidden');
  }

  /**
   * Hide the inline validation message.
   */
  hideAlert() {
    this.inputAlert.classList.add('hidden');
  }

  /**
   * Toggle the animated typing indicator.
   * @param {boolean} show 
   */
  setTyping(show) {
    if (show) {
      this.typingIndicator.classList.remove('hidden');
      this.scrollToBottom();
    } else {
      this.typingIndicator.classList.add('hidden');
    }
  }

  /**
   * Toggle user inputs to prevent duplicate rapid requests.
   * @param {boolean} disabled 
   */
  setFormDisabled(disabled) {
    this.isProcessing = disabled;
    this.userInput.disabled = disabled;
    this.sendBtn.disabled = disabled;
    if (!disabled) {
      this.userInput.focus();
    }
  }

  /**
   * Handles user submission from the text field.
   */
  async handleFormSubmit() {
    if (this.isProcessing) return;

    const query = this.userInput.value.trim();

    // Input validation
    if (!this.validateInput(query)) {
      return;
    }

    // 1. Render User Message
    this.renderMessage({
      sender: 'user',
      text: query,
      timestamp: this.getCurrentTimeString()
    });

    // Clear input field
    this.userInput.value = '';
    this.setFormDisabled(true);
    this.setTyping(true);

    try {
      // 2. Fetch Response through decoupled ChatService
      const reply = await ChatService.sendMessage(query);

      // 3. Render Assistant Response
      this.setTyping(false);
      this.renderMessage({
        sender: 'bot',
        text: reply.text,
        isDemo: reply.isDemo,
        timestamp: this.getCurrentTimeString()
      });
    } catch (err) {
      console.error("Error processing query:", err);
      this.setTyping(false);
      this.renderMessage({
        sender: 'bot',
        text: "An unexpected error occurred while preparing a response. Please try again.",
        isDemo: true,
        timestamp: this.getCurrentTimeString()
      });
    } finally {
      this.setFormDisabled(false);
    }
  }

  /**
   * Handles click on quick topic button from the sidebar.
   * @param {string} topicKey 
   * @param {string} topicName 
   */
  async handleTopicSelect(topicKey, topicName) {
    if (this.isProcessing) return;

    this.hideAlert();

    // Show simulated user message indicating the requested topic
    const userPrompt = `Show guidance for: ${topicName}`;
    this.renderMessage({
      sender: 'user',
      text: userPrompt,
      timestamp: this.getCurrentTimeString()
    });

    this.setFormDisabled(true);
    this.setTyping(true);

    try {
      const reply = await ChatService.getTopicResponse(topicKey);

      this.setTyping(false);
      this.renderMessage({
        sender: 'bot',
        text: reply.text,
        isDemo: reply.isDemo,
        timestamp: this.getCurrentTimeString()
      });
    } catch (err) {
      console.error("Error fetching topic guidance:", err);
      this.setTyping(false);
    } finally {
      this.setFormDisabled(false);
    }
  }

  /**
   * Format basic text with markdown-like bolding and lists safely.
   * @param {string} rawText 
   * @returns {string} Sanitized HTML string
   */
  formatMessageContent(rawText) {
    // Basic HTML escaping
    const escapeHtml = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const lines = rawText.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        const itemContent = escapeHtml(trimmed.substring(2));
        // Bold formatting
        const formatted = itemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<li>${formatted}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }

        if (trimmed.length === 0) {
          // Empty line separation
          html += '<p class="bubble-spacer"></p>';
        } else {
          const escaped = escapeHtml(trimmed);
          const formatted = escaped
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
          html += `<p>${formatted}</p>`;
        }
      }
    });

    if (inList) {
      html += '</ul>';
    }

    return html;
  }

  /**
   * Append a message bubble to the chat container.
   * @param {{sender: 'bot'|'user', text: string, isDemo?: boolean, timestamp: string}} messageData 
   */
  renderMessage(messageData) {
    const { sender, text, isDemo, timestamp } = messageData;

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${sender}`;

    const avatarEl = document.createElement('div');
    avatarEl.className = 'msg-avatar';
    avatarEl.setAttribute('aria-hidden', 'true');
    avatarEl.textContent = sender === 'bot' ? '🤖' : '👤';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'msg-content-wrapper';

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'msg-bubble';

    // If it's a demo assistant response, append clear indicator badges and disclaimer
    let bubbleContentHtml = '';
    if (sender === 'bot' && isDemo) {
      bubbleContentHtml += `<span class="demo-badge-pill">[Demo Response]</span>`;
    }

    bubbleContentHtml += this.formatMessageContent(text);

    if (sender === 'bot' && isDemo) {
      bubbleContentHtml += `
        <div class="demo-disclaimer-note">
          ⚠️ <em>Institutional Notice:</em> Demo guidance only. Verify specific eligibility, deadlines, and official forms with your college administration.
        </div>
      `;
    }

    bubbleEl.innerHTML = bubbleContentHtml;

    const timeEl = document.createElement('span');
    timeEl.className = 'msg-time';
    timeEl.textContent = timestamp;

    contentWrapper.appendChild(bubbleEl);
    contentWrapper.appendChild(timeEl);

    messageEl.appendChild(avatarEl);
    messageEl.appendChild(contentWrapper);

    this.chatMessages.appendChild(messageEl);
    this.scrollToBottom();
  }

  /**
   * Smoothly scroll message container to the latest message.
   */
  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  /**
   * Format current time as readable string (e.g. "08:45 PM").
   * @returns {string}
   */
  getCurrentTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

// ============================================================================
// 5. APPLICATION INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI Controller
  window.welfareApp = new WelfareUI();
  console.log("Student Welfare Assistant initialized successfully in Demo Mode.");
});
