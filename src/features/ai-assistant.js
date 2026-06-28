/* ============================================================
   VELORA — AI Assistant Feature
   ============================================================ */

import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import aiService from '../services/ai-service.js';

export async function renderAIAssistantPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('ai-assistant', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>AI Assistant</h1>
      <p>Your intelligent mobility companion</p>
    </div>
  `;

  // Chat panel
  const chatPanel = document.createElement('div');
  chatPanel.className = 'card--dark';
  chatPanel.style.cssText = 'display:flex;flex-direction:column;min-height:500px;';

  // Messages area
  const messagesArea = document.createElement('div');
  messagesArea.id = 'ai-messages';
  messagesArea.style.cssText = 'flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;max-height:450px;';

  // Welcome message
  const conv = aiService.startConversation();
  conv.messages.forEach(msg => {
    messagesArea.appendChild(renderChatMessage(msg.text, msg.role === 'ai' ? 'ai' : 'user', msg.suggestions));
  });

  chatPanel.appendChild(messagesArea);

  // Input area
  const inputArea = document.createElement('div');
  inputArea.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid rgba(255,255,255,0.08);';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'ai-input';
  input.placeholder = 'Ask about routes, safety, weather...';
  input.style.cssText = 'flex:1;padding:10px 0;font-size:14px;color:#fff;background:transparent;border:none;outline:none;';

  const sendBtn = document.createElement('button');
  sendBtn.style.cssText = 'width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:#E8A020;border-radius:50%;color:#000;border:none;cursor:pointer;flex-shrink:0;';
  sendBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  inputArea.appendChild(input);
  inputArea.appendChild(sendBtn);
  chatPanel.appendChild(inputArea);

  main.appendChild(chatPanel);

  // Suggestions
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.id = 'ai-suggestions';
  suggestionsContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;';

  const suggestionQueries = [
    'Get me to college before 9',
    'Which route is safest tonight?',
    'My grandmother needs wheelchair access',
    'Which bus has empty seats?',
    'Can I avoid rain?',
    'Help, I need emergency assistance',
  ];

  suggestionQueries.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'btn btn--secondary-dark btn--sm';
    btn.textContent = q;
    btn.addEventListener('click', () => {
      input.value = q;
      sendMessage();
    });
    suggestionsContainer.appendChild(btn);
  });

  main.appendChild(suggestionsContainer);

  page.appendChild(main);

  const mobileNav = renderMobileNav('ai-assistant');
  page.appendChild(mobileNav);

  // ─── Chat Logic ───
  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    const userMsg = renderChatMessage(text, 'user');
    messagesArea.appendChild(userMsg);
    input.value = '';

    // Get AI response
    const result = aiService.sendMessage(text);
    setTimeout(() => {
      const aiMsg = renderChatMessage(result.aiMessage.text, 'ai', result.aiMessage.suggestions);
      messagesArea.appendChild(aiMsg);
      messagesArea.scrollTop = messagesArea.scrollHeight;

      // Update suggestions
      if (result.aiMessage.suggestions && result.aiMessage.suggestions.length > 0) {
        suggestionsContainer.innerHTML = '';
        result.aiMessage.suggestions.forEach(s => {
          const btn = document.createElement('button');
          btn.className = 'btn btn--secondary-dark btn--sm';
          btn.textContent = s;
          btn.addEventListener('click', () => {
            input.value = s;
            sendMessage();
          });
          suggestionsContainer.appendChild(btn);
        });
      }
    }, 500);

    messagesArea.scrollTop = messagesArea.scrollHeight;
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  return page;
}

function renderChatMessage(text, role, suggestions = []) {
  const div = document.createElement('div');
  div.className = `chat-message chat-message--${role}`;
  div.style.cssText = 'display:flex;gap:8px;animation:fade-in-up 300ms ease-out;';

  const avatar = document.createElement('div');
  avatar.className = `chat-message__avatar chat-message__avatar--${role}`;
  avatar.textContent = role === 'ai' ? 'AI' : 'U';

  const bubble = document.createElement('div');
  bubble.className = 'chat-message__bubble';
  bubble.style.cssText = role === 'ai'
    ? 'max-width:80%;padding:10px 14px;background:rgba(255,255,255,0.06);border-radius:12px;border-bottom-left-radius:4px;color:#fff;font-size:13px;line-height:1.6;'
    : 'max-width:80%;padding:10px 14px;background:#E8A020;border-radius:12px;border-bottom-right-radius:4px;color:#000;font-size:13px;line-height:1.6;';
  bubble.textContent = text;

  div.style.flexDirection = role === 'user' ? 'row-reverse' : 'row';
  div.appendChild(avatar);
  div.appendChild(bubble);

  return div;
}
