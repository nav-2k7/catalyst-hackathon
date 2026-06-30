import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Check if the API key is actually loaded
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing from your .env.local file.");
    }

    const { messages } = await req.json();

    // 2. Stream the response with the tools enabled
    const result = await streamText({
      model: google('gemini-1.5-flash'), 
      messages,
      system: `You are Catalyst, a proactive AI assistant. You help users manage their time and tasks. 
               Use your tools to perform actions like rescheduling meetings, drafting documents, or writing emails when appropriate.`,
      tools: {
        reschedule_meeting: tool({
          description: 'Reschedules a calendar meeting.',
          parameters: z.object({
            meetingTitle: z.string().describe('The title of the meeting to reschedule.'),
            newDate: z.string().describe('The new date and time for the meeting.'),
          }),
          execute: async ({ meetingTitle, newDate }) => {
            return { success: true, actionTaken: `Moved "${meetingTitle}" to ${newDate}.` };
          },
        }),
        draft_document: tool({
          description: 'Drafts an outline or document for a project or presentation.',
          parameters: z.object({
            title: z.string().describe('The title or topic of the document.'),
          }),
          execute: async ({ title }) => {
            return { success: true, docUrl: `https://docs.google.com/document/mock-url`, actionTaken: `Created document: "${title}"` };
          }
        }),
        draft_email: tool({
          description: 'Drafts an email to a client or colleague.',
          parameters: z.object({
            recipient: z.string().describe('Who the email is for.'),
            subject: z.string().describe('The subject of the email.'),
          }),
          execute: async ({ recipient, subject }) => {
            return { success: true, actionTaken: `Drafted email to ${recipient} regarding "${subject}".` };
          }
        })
      }
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    // 3. Catch the error and send it directly to the frontend to display
    console.error("API Error Caught:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred connecting to Google." }), 
      { status: 500 }
    );
  }
}