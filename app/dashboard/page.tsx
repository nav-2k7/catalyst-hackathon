'use client';

import { useChat } from '@ai-sdk/react';

export default function Dashboard() {
  // We added 'error' here so the UI can catch and display backend failures
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    api: '/api/chat'
  });

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white p-6 font-sans">
      <header className="mb-6 border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold">Catalyst Dashboard</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-8">
        {/* THIS IS NEW: It will show a red box if the AI connection fails */}
        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
            <strong>Connection Failed:</strong> {error.message}
            <p className="text-sm mt-2 opacity-80">
              If this says "400", "403", or mentions authentication, your API key in .env.local is expired or invalid.
            </p>
          </div>
        )}

        {/* Normal Chat Messages */}
        {messages.map((m) => (
          <div key={m.id} className="p-4 bg-neutral-900 rounded-2xl border border-neutral-700">
            <strong className="text-blue-400">{m.role === 'user' ? 'You: ' : 'Catalyst: '}</strong> 
            <span className="leading-relaxed">{m.content}</span>
            
            {/* Display tool invocations if they exist */}
            {m.toolInvocations?.map((tool: any, i: number) => (
              <div key={i} className="text-xs text-yellow-500 mt-3 p-3 bg-black/40 rounded-lg font-mono">
                ⚡ [Tool Executed: {tool.toolName}]
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          value={input}
          onChange={handleInputChange}
          placeholder="Type here..."
        />
        <button 
          type="submit" 
          className="bg-white px-8 py-4 rounded-xl text-black font-bold hover:bg-neutral-200 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}