/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // This makes GOOGLE_GENERATIVE_AI_API_KEY available to your server code
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
};

module.exports = nextConfig;