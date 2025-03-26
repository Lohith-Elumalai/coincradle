<<<<<<< HEAD
// src/pages/AIChat.jsx
import { useState, useEffect, useRef, useContext } from 'react';
import { useQuery } from 'react-query';
import AuthContext from '../contexts/AuthContext';
import FinanceDataContext from '../contexts/FinanceDataContext';
import { aiService } from '../services/ai.service';
import ChatInterface from '../components/chat/ChatInterface';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';

const AIChat = () => {
  const { currentUser } = useContext(AuthContext);
  const { transactions, accounts, insights } = useContext(FinanceDataContext);
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch chat history
  const { data: chatHistory, isLoading: historyLoading } = useQuery(
    ['chatHistory', currentUser?.id],
    () => aiService.getChatHistory(),
    {
      enabled: !!currentUser,
      onError: (err) => setError('Failed to load chat history'),
    }
  );

  // Load initial welcome message and history
  useEffect(() => {
    if (chatHistory && !historyLoading) {
      if (chatHistory.length > 0) {
        setMessages(chatHistory);
      } else {
        // Welcome message if no history
        setMessages([
          {
            id: 'welcome',
            sender: 'ai',
            content: `Hello ${currentUser?.firstName || 'there'}! I'm your AI financial assistant. I can help you understand your finances, create budgets, or suggest investment strategies. What would you like help with today?`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
  }, [chatHistory, historyLoading, currentUser]);

  // Scroll to bottom of chat when messages change
=======
import { useState, useRef, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import ChatInterface from '../components/chat/ChatInterface';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const { sendMessage, isLoading, error } = useAI();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

>>>>>>> 4404e68ff82ae876e615fd84634bb867448f2e6f
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

<<<<<<< HEAD
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message to AI
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // Show typing indicator
      setMessages((prev) => [
        ...prev,
        { id: 'typing', sender: 'ai', content: '', typing: true },
      ]);

      // Send to AI service with context
      const response = await aiService.sendMessage(content, {
        recentTransactions: transactions.slice(0, 10),
        accountBalances: accounts.map(a => ({ 
          name: a.name, 
          balance: a.balance,
          type: a.type
        })),
        insights
      });

      // Remove typing indicator and add AI response
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== 'typing');
        return [
          ...filtered,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            content: response.message,
            timestamp: new Date().toISOString(),
            suggestions: response.suggestions || [],
          },
        ];
      });
    } catch (err) {
      setError('Failed to get response. Please try again.');
      // Remove typing indicator
      setMessages((prev) => prev.filter(m => m.id !== 'typing'));
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">AI Financial Assistant</h1>
        <p className="text-gray-600">
          Ask questions about your finances, get personalized advice, or explore financial concepts
        </p>
      </div>

      <div className="flex flex-1 flex-col rounded-lg bg-white shadow-lg">
        <ChatInterface>
          {historyLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="spinner"></div>
              <p className="ml-2 text-gray-500">Loading your conversation...</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onSuggestionClick={handleSuggestionClick}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {error && (
                <div className="mx-4 mb-2 rounded bg-red-100 p-2 text-red-700">
                  {error}
                </div>
              )}
              
              <ChatInput onSendMessage={sendMessage} loading={loading} />
            </>
          )}
        </ChatInterface>
      </div>
    </div>
=======
  const handleSend = async (text) => {
    const newMessage = { content: text, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    
    try {
      const response = await sendMessage(text);
      setMessages(prev => [...prev, { content: response, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        content: "Sorry, I'm having trouble connecting. Please try again later.", 
        isBot: true 
      }]);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen p-4 bg-gray-50">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage 
              key={index}
              message={msg.content}
              isBot={msg.isBot}
            />
          ))}
          {isLoading && (
            <ChatMessage 
              message={<div className="animate-pulse">Analyzing...</div>}
              isBot={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput 
          onSend={handleSend}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </ProtectedRoute>
>>>>>>> 4404e68ff82ae876e615fd84634bb867448f2e6f
  );
};

export default AIChat;