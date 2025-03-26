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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
  );
};

export default AIChat;