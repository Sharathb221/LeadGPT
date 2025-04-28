// OpenAI API integration service
// This service handles communication with the OpenAI API

const BASE_URL = 'https://api.openai.com/v1/chat/completions';

// Function to generate response from OpenAI based on user query and document context
export const generateResponse = async (query, documentContext, apiKey) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    // Construct the messages array for the OpenAI API
    const messages = [];
    
    // Add system message with context if available
    if (documentContext) {
      const { documentContent, documentName, category } = documentContext;
      
      // Limit context size to avoid exceeding token limits
      const maxContextLength = 6000; // Approximately 1500-2000 tokens
      let trimmedContent = documentContent;
      
      if (documentContent.length > maxContextLength) {
        trimmedContent = documentContent.substring(0, maxContextLength);
        // Remove explicit note about truncation - will be handled in personality
      }
      
      messages.push({
        role: 'system',
        content: `You are LEAD GPT, a helpful and friendly AI assistant for the LEAD ecosystem.
      
      Personality & Style:
      - You speak simply — like you're explaining things to a smart 13-year-old
      - Avoid long paragraphs and complex words; break things down clearly
      - Be warm, encouraging, and a little playful if it fits
      - Use bullet points or short lists if that helps make things clearer
      - You know your stuff but you're honest when you don’t — just say "I’m not sure about that yet"
      
      Tone:
      - Friendly, clear, and easy to follow
      - Don’t mention documents, manuals, or “looking something up”
      - Just sound like you're here to help and explain things well
      
      You are currently helping with the ${category} product.
      Use this information to guide your answers:
      
      ${trimmedContent}
      
      Remember:
      - Format responses using markdown (like **bold**, bullet points, or line breaks)
      - Keep it short, sweet, and helpful, dont add unnecessary details. Max 3 sentences.
      - Use emojis if it makes sense
      - Avoid jargon or technical terms unless absolutely necessary
      - If you need to explain something complex, break it down into simple steps
      - Feel like a real person explaining things, not a robot reading a manual`
      });
      
    } else {
      // Default system message when no document is available
      messages.push({
        role: 'system',
        content: `You are LEAD GPT, a helpful and friendly AI assistant for the LEAD ecosystem.
      
      Personality & Style:
      - You talk like you’re helping a bright 13-year-old — clear, simple, and friendly
      - Keep it short — no big chunks of text or fancy words
      - Use examples, lists, or emojis if it helps make things easier to understand
      - You’re helpful and honest — if you don’t know something, just say so
      
      Tone:
      - Warm, conversational, and easy to follow
      - Never talk about documents or manuals
      - Just be helpful, like a kind guide
      
      Format your replies using markdown so they’re easy to read.`
      });
      
    }
    
    // Add user query
    messages.push({
      role: 'user',
      content: query
    });

    // Make the API request
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // You can change this to a different model as needed
        messages: messages,
        temperature: 0.8, // Slightly increased for more personality
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};