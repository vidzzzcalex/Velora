/* ============================================================
   VELORA — AI Assistant Service
   ============================================================ */

import { generateId } from '../utils.js';
import { generateAIResponse } from './mock-data.js';

class AIService {
  constructor() {
    this.conversations = new Map();
    this.currentId = null;
  }

  startConversation(context = {}) {
    const id = generateId();
    const conversation = {
      id,
      messages: [
        {
          id: generateId(),
          role: 'ai',
          text: "Welcome to VELORA. I'm your mobility assistant. I can help you plan journeys, check real-time transit, find safe routes, or optimize for your preferences. Where would you like to go today?",
          timestamp: new Date().toISOString(),
        },
      ],
      context: {
        location: context.location || null,
        time: new Date().toISOString(),
        preferences: context.preferences || {},
        ...context,
      },
      createdAt: new Date().toISOString(),
    };
    this.conversations.set(id, conversation);
    this.currentId = id;
    return conversation;
  }

  getConversation(id = null) {
    const convId = id || this.currentId;
    return this.conversations.get(convId) || this.startConversation();
  }

  sendMessage(text, conversationId = null) {
    const conversation = this.getConversation(conversationId);
    
    // Add user message
    const userMessage = {
      id: generateId(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    conversation.messages.push(userMessage);

    // Generate AI response
    const response = generateAIResponse(text, conversation.messages);
    
    const aiMessage = {
      id: response.id,
      role: 'ai',
      text: response.text,
      suggestions: response.suggestions || [],
      timestamp: response.timestamp || new Date().toISOString(),
    };
    conversation.messages.push(aiMessage);

    return {
      userMessage,
      aiMessage,
      conversation,
    };
  }

  getSuggestions(conversationId = null) {
    const conversation = this.getConversation(conversationId);
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage?.suggestions || [];
  }

  clearConversation(id = null) {
    const convId = id || this.currentId;
    if (convId) {
      this.conversations.delete(convId);
    }
    this.currentId = null;
  }

  getHistory(conversationId = null) {
    const conversation = this.getConversation(conversationId);
    return conversation.messages.filter(m => m.role === 'user').map(m => m.text);
  }
}

export const aiService = new AIService();
export default aiService;
