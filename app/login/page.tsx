'use client';

import { useState } from 'react';

// NOTE: Since the environment is currently unable to resolve the Supabase package,
// we are mocking the client initialization. In your actual local development 
// environment, you can restore the import { createClient } from '@supabase/supabase-js'; 
// and the standard client initialization.

const supabase = {
  auth: {
    signInWithOAuth: async (options: any) => {
      console.log('Mocking OAuth flow for:', options);
      return { error: null };
    }
  }
};

export default function CatalystLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/gmail.send',
        queryParams: { access_type: 'offline', prompt: 'consent' },
        redirectTo: 'http://localhost:3000/dashboard'
      },
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Catalyst</h1>
        <p className="text-neutral-400 mb-8">Your autonomous hackathon partner.</p>
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-neutral-200 transition-colors"
        >
          {isLoading ? "Connecting..." : "Authorize Catalyst"}
        </button>
      </div>
    </div>
  );
}