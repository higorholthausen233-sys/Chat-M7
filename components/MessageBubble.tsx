
import React from 'react';
import { Message, MessageRole } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-beauty-900 text-white rounded-br-none shadow-md'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
        } ${message.isError ? 'bg-red-50 text-red-600 border border-red-200' : ''}`}
      >
        {message.text}
        <div className={`text-[10px] mt-2 opacity-70 ${isUser ? 'text-gray-300' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
