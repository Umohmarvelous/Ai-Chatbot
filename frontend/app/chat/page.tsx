'use client';

import ChatBot from '@/components/ChatBot';
import CosmicOrb from '@/components/CosmicOrb';

export default function ChatPage() {
  return (
    <div 
      className="h-screen relative overflow-hidden flex flex-col bg-gradient-to-b from-teal-700 to-black">
      {/* CosmicOrb at the top */}
      <div className="relative z-50">
        <CosmicOrb />
        {/* [#202e32] */}
        <div className="text-center relative flex-shrink-0 z-50 flex flex-col justify-between h-auto py-0">
          <div className='relative h-full'>
            <h1 
              className="text-3xl md:text-4xl -z-10 font-bold uppercase"
              style={{ color: '#dfdcb9' }}
            >
              Aura Chatbot
            </h1>
          </div>
        </div>
      </div>
        
      {/* Chat container with vertical scroll */}
      <div className="flex overflow-hidden relative -z-0 items-center justify-center">
        
        <ChatBot />

      </div>
    </div>
  );
}
