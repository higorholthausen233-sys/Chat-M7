
import React, { useState, useEffect, useRef } from 'react';
import { Message, MessageRole } from '../types';
import { MessageBubble } from './MessageBubble';
import { sendMessageStream, initializeChat, resetChat } from '../services/aiService';
import { INITIAL_GREETING } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat on mount
  useEffect(() => {
    initializeChat();
    // Add initial greeting
    setMessages([
      {
        id: 'init-1',
        role: MessageRole.MODEL,
        text: INITIAL_GREETING,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    setInputText('');
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: userMessageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessagePlaceholder: Message = {
      id: aiMessageId,
      role: MessageRole.MODEL,
      text: '',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    try {
      let fullResponse = "";
      
      await sendMessageStream(userMessageText, (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMessageId 
              ? { ...msg, text: fullResponse } 
              : msg
          )
        );
      });

    } catch (error) {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMessageId 
            ? { ...msg, text: "Desculpe, tive um problema ao processar sua resposta. Tente novamente.", isError: true } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      // Focus back on input for desktop users, helpful for course pacing
      if (window.matchMedia('(min-width: 768px)').matches) {
          inputRef.current?.focus();
      }
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Deseja limpar o histórico da conversa com M7?')) {
      resetChat();
      setMessages([
        {
          id: Date.now().toString(),
          role: MessageRole.MODEL,
          text: INITIAL_GREETING,
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-2xl md:shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-beauty-900 flex items-center justify-center text-white">
            <span className="font-bold text-lg tracking-wider">M7</span>
          </div>
          <div>
            <h2 className="font-bold text-beauty-900 tracking-tight">M7 Intelligence</h2>
            <p className="text-xs text-beauty-500 font-medium">Estética & Performance</p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="p-2 text-gray-400 hover:text-beauty-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Reiniciar Sessão"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === MessageRole.USER && (
           <div className="flex justify-start animate-pulse">
             <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none text-gray-500 text-sm shadow-sm">
                <span className="flex space-x-1 items-center">
                  <span className="text-xs mr-2 font-medium">M7 digitando</span>
                  <span className="w-1.5 h-1.5 bg-beauty-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-beauty-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-beauty-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: Recomende produtos para pele oleosa..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-beauty-900/10 focus:border-beauty-900 transition-all text-gray-700 placeholder-gray-400 font-light"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-md transition-all ${
              !inputText.trim() || isLoading
                ? 'bg-transparent text-gray-300 cursor-not-allowed'
                : 'bg-beauty-900 text-white shadow-md hover:bg-black'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </form>
        <div className="text-center mt-2">
           <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">M7 • A.I. Aesthetics System</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
