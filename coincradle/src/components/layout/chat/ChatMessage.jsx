// src/components/chat/ChatMessage.jsx
import React from 'react';

const ChatMessage = ({ message, onSuggestionClick }) => {
  const { sender, content, typing, suggestions } = message;
  
  const isAI = sender === 'ai';
  
  return (
    <div className={`mb-4 flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-3/4 rounded-lg p-3 ${
          isAI
            ? 'rounded-tl-none bg-white text-gray-800 shadow'
            : 'rounded-tr-none bg-blue-600 text-white'
        }`}
      >
        {/* AI typing indicator */}
        {typing ? (
          <div className="flex items-center">
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
            <div className="mx-1 h-2 w-2 animate-pulse rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : (
          <>
            {/* Regular message content */}
            <div className="whitespace-pre-wrap">{content}</div>
            
            {/* Suggestions from AI */}
            {isAI && suggestions && suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 transition-colors hover:bg-blue-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
