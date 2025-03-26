// src/components/chat/ChatInterface.jsx
import React from 'react';

const ChatInterface = ({ children }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      {children}
    </div>
  );
};

export default ChatInterface;