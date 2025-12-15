'use client';

import { useState, useRef, useEffect } from 'react';
import LiquidGlass from './LiquidGlass';
import { color } from 'three/tsl';
import { ArrowUp, Globe, Mic, Paperclip, Search } from 'lucide-react';

// Format time consistently to avoid hydration mismatch
function formatTime(timestamp: Date): string {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
}

// Client-side only time display component to avoid hydration mismatch
function TimeDisplay({ timestamp, textColor }: { timestamp: Date; textColor: string }) {
  const [timeString, setTimeString] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTimeString(formatTime(timestamp));
  }, [timestamp]);

  // Return empty during SSR to avoid mismatch
  if (!isMounted) {
    return (
      <span 
        className="text-xs font-semibold mt-0 block opacity-60"
        style={{ color: textColor }}
      />
    );
  }

  return (
    <span 
      className="text-xs font-semibold mt-0 block opacity-60"
      style={{ color: textColor }}
    >
      {timeString}
    </span>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Color palette
const colors = ['#85937a', '#586c5c', 'red', '#000', '#fff'];

const getColorForMessage = (messageId: string, role: 'user' | 'assistant') => {
  const hash = messageId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[4];
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello!  How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error 
          ? `${error.message}. Please make sure you are connected to an internet and try again.`
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
        
      <div className="z-50 w-full max-w-4xl flex flex-col h-full p-4 
      pt-0 md:p-6 pb-0 md:pb-0">
          
        {/* Messages Container */}
        <div className=" flex-1 overflow-y-auto space-y-12 px-2 pb-0 mb-8">
      
          {messages.map((message, index) => {
            const textColor = getColorForMessage(message.id, message.role);
            const colorIndex = index % colors.length;
            return (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                
                <LiquidGlass variant={message.role === 'user' ? 'input' : 'output'} colorIndex={colorIndex} 
                className={`${message.role === 'user' ? 'bg-[#85937a] rounded-2xl ' : 'bg-[#202e32] rounded-2xl'} 
                relative bg-white/10  backdrop-blur-2xl border border-white/10 rounded-[2rem] p-0 overflow-hidden `}
                >
                  <div
                    className={`max-w-xs  md:max-w-sm ${
                      message.role === 'user' ? 'text-left' : 'text-left'
                    }`}
                  >
                    <p 
                      className="text-sm md:text-base leading-relaxed whitespace-pre-wrap"
                      style={{ color: textColor }}
                    >
                      {message.content}
                    </p>
                    <div className='flex items-center justify-end  h-auto '>
                      <TimeDisplay timestamp={message.timestamp} textColor={colors[2]} />
                    </div>
                  </div>
                </LiquidGlass>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <LiquidGlass variant="output">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: colors[3],
                        animationDelay: '0ms' 
                      }} 
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: colors[1],
                        animationDelay: '150ms' 
                      }} 
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: colors[4],
                        animationDelay: '300ms' 
                      }} 
                    />
                  </div>
                </div>
              </LiquidGlass>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

      
        <form 
        onSubmit={handleSubmit}
        className="">
          <LiquidGlass variant='input'
          className='relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[160px]'
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="w-full bg-transparent text-lg text-white/90 placeholder-white/40 outline-none resize-none h-24 scrollbar-hide font-medium leading-relaxed"
              style={{ minHeight: '80px', color: colors[0] }}
            />

            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/5 flex-shrink-0 group/icon">
                  <Paperclip size={18} className="group-hover/icon:stroke-white transition-colors" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium text-blue-100/80 transition-all whitespace-nowrap group/btn">
                  <Search size={16} className="text-blue-300 group-hover/btn:text-blue-200" />
                  <span>Deep search</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium text-blue-100/80 transition-all whitespace-nowrap group/btn">
                  <Globe size={16} className="text-blue-300 group-hover/btn:text-blue-200" />
                  <span>Search</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pl-2 flex-shrink-0">
                
                <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/5 group/mic">
                
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <Mic size={20} className="group-hover/mic:text-white transition-colors" />
                  </div>
                </button>

                <button 
                  type="submit"
                  className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-green-900/20 ${
                    input.trim() 
                      ? 'bg-[#4ade80] hover:bg-[#22c55e] text-slate-900' 
                      : 'bg-[#4ade80]/40 text-slate-900/50 cursor-not-allowed'
                  }`}
                  disabled={isLoading || !input.trim()}
                >
                  <ArrowUp size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </LiquidGlass>
        </form>

        <div className="relative my-3 text-center">
            <p className="text-xs text-white/20 font-light">Powered by VinAura</p>
        </div>
      </div>
    </>
  );
}

