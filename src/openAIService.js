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
      // Typically, OpenAI models have a token limit (e.g., 4096 for GPT-3.5)
      const maxContextLength = 6000; // Approximately 1500-2000 tokens
      let trimmedContent = documentContent;
      
      if (documentContent.length > maxContextLength) {
        trimmedContent = documentContent.substring(0, maxContextLength) + 
          "\n\n[Note: Document was truncated due to length. This is only a portion of the full document.]";
      }
      
      messages.push({
        role: 'system',
        content: `You are LEAD GPT, an AI assistant for the LEAD ecosystem. 
        You are currently helping with the ${category} product.
        You have access to the following information from the document "${documentName}":
        
        ${trimmedContent}
        
        Use this document to answer user questions accurately. If the information to answer a query is not in the document, politely state that you don't have that information and suggest that the user upload more documentation or contact the product owner. Give all responses in markdown format. simplify wherever possible without information dilution / loss`
      });
    } else {
      // Default system message when no document is available
      messages.push({
        role: 'system',
        content: `You are LEAD GPT, an AI assistant for the LEAD ecosystem. 
        You can answer general questions about LEAD's products, but for specific information, 
        the user should upload product documentation in the Settings page.`
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
        temperature: 0.7,
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