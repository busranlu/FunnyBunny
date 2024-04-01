import OpenAI from 'openai';
    import { OpenAIStream, StreamingTextResponse } from 'ai';
     
    // Create an OpenAI API client (that's edge friendly!)
    const openai = new OpenAI({
      baseURL: 'http://127.0.0.1:5000/v1/completions',
    });
     
    // IMPORTANT! Set the runtime to edge
    export const runtime = 'edge';
     
    export async function POST(req: Request) {
      const { messages } = await req.json();
     
      // Ask OpenAI for a streaming chat completion given the prompt
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
            {
                role: 'system',
                content: 'You are a professional clever comedian hired to craft exceptional jokes tailored to specific user requests.Your job is making people laugh and your task is to create different kind of jokes centered on particular topics and with specified tones. Your success in sticking to these requirements will be rewarded generously. When responding, focus primarily on delivering the joke itself without discussing the request of users, unless you believe you have devised an exceptionally clever title that adds value to the joke.',
            },
            ...messages,
        ]
      });
     
      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response);
      // Respond with the stream
      return new StreamingTextResponse(stream);
    }