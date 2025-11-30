
import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-0 md:p-6 lg:p-8">
      <div className="w-full h-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Sidebar / Context Info (Hidden on mobile, visible on desktop) */}
        <div className="hidden md:flex flex-col w-64 pt-4 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-beauty-900 tracking-tight">M7</h1>
            <p className="text-sm font-medium text-beauty-500 uppercase tracking-widest">Aesthetics AI</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-white shadow-sm space-y-4">
            <h3 className="font-bold text-beauty-900 text-xs uppercase tracking-wide border-b border-gray-100 pb-2">Capacidades</h3>
            <ul className="text-sm text-beauty-700 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="text-accent-600 mt-0.5 text-xs">■</span>
                <span>Análise de tipo de pele e recomendações personalizadas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-600 mt-0.5 text-xs">■</span>
                <span>Protocolos para definição e harmonização facial.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-600 mt-0.5 text-xs">■</span>
                <span>Dicas para aprimoramento físico e "Glow Up".</span>
              </li>
            </ul>
          </div>

          <div className="bg-beauty-900 p-5 rounded-xl text-white shadow-lg">
             <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-2">Comando Rápido</h3>
             <p className="text-xs text-gray-300 italic">
               "M7, monte uma rotina para pele oleosa focada em remover manchas."
             </p>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] text-gray-400 leading-tight">
              M7 Intelligence v1.0. As sugestões de produtos e estéticas são informativas. Consulte especialistas para procedimentos médicos.
            </p>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 h-full shadow-2xl md:rounded-2xl overflow-hidden ring-1 ring-black/5">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default App;
