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
    if (documentContext && documentContext.documentContent) {
      const { documentContent, documentName, category } = documentContext;
      
      messages.push({
        role: 'system',
        content: `You are LEAD GPT, an AI assistant for the LEAD ecosystem. 
        You are currently helping with the ${category} product.
        Use the following information to answer user queries:
        
        ${documentContent}
        
        When answering:
        1. Be conversational and natural - don't mention the documentation or reference it
        2. Break complex information into simple, clear explanations
        3. For step-by-step procedures, format each step as a separate message block
        4. Be concise and avoid unnecessary information
        5. If the information is not available, simply suggest contacting support`
      });
    } else {
      // Default system message when no document is available
      messages.push({
        role: 'system',
        content: `You are LEAD GPT, an AI assistant for the LEAD ecosystem. 
        You can answer general questions about LEAD's products, but you don't have specific documentation loaded.
        Suggest the user upload documentation through the Settings page for more detailed help.`
      });
    }
    
    // Add user query
    messages.push({
      role: 'user',
      content: query
    });

    // For demo purposes, simulate the OpenAI API response
    // In a production environment, you would use the actual API call
    const simulatedResponse = simulateOpenAIResponse(query, documentContext);
    
    // Uncomment and use this code for actual OpenAI API integration
    /*
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
    */
    
    // Return the simulated response for now
    return simulatedResponse;
    
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

// Function to simulate OpenAI API response for demo purposes with cleaner formatting
const simulateOpenAIResponse = (query, documentContext) => {
  // If no document context is available, return a default message
  if (!documentContext || !documentContext.documentContent) {
    return `I don't have specific information about this product yet. You can upload documentation through the Settings page to help me provide better assistance.`;
  }
  
  const { documentContent } = documentContext;
  
  // Clean up the query and document content for matching
  const queryLower = query.toLowerCase().trim();
  const contentLower = documentContent.toLowerCase();
  
  // Check for common query patterns and provide appropriate responses
  
  // Installation questions
  if (queryLower.includes('install') || queryLower.includes('download') || queryLower.includes('get the app')) {
    if (contentLower.includes('installation') || contentLower.includes('install')) {
      return `The LEAD Student App V5.0 is available on both Apple App Store and Google Play Store.

You'll need:
• iOS 12+ or Android 8.0+
• At least 80MB of free space

Ready to get started? Here's what you'll need to do:

1. Download the app from your device's app store
2. Launch the app
3. Sign Up 

And that's it! You're all set to start using the app.`;
    }
  }
  
  // Feature questions
  if (queryLower.includes('feature') || queryLower.includes('what can') || queryLower.includes('capabilities') || queryLower.includes('do with')) {
    if (contentLower.includes('feature') || contentLower.includes('key feature')) {
      return `The Student App comes with several helpful features to support your learning:

• Digital Textbooks - Access all your assigned books digitally in one place

• Assignment Tracker - Never miss a deadline with due date reminders and submission tracking

• Progress Reports - See your grades and teacher feedback in real-time 

• Study Planner - Create custom study schedules with smart reminders

• In-app Messaging - Talk directly with your teachers when you need help

Is there a specific feature you'd like to know more about?`;
    }
  }
  
  // Troubleshooting questions
  if (queryLower.includes('problem') || queryLower.includes('issue') || queryLower.includes('not working') || queryLower.includes('troubleshoot') || queryLower.includes('error')) {
    if (contentLower.includes('troubleshoot') || contentLower.includes('common issue') || contentLower.includes('problem')) {
      return `I can help troubleshoot common issues with the Student App:

If you're having trouble logging in:
• Try the "Forgot Password" option on the login screen
• Contact your school administrator to verify your account details

If content isn't loading properly:
• Check your internet connection
• Try closing and reopening the app
• Clear the app cache in your device settings

For assignment submission errors:
• Make sure your file is under 20MB
• Check that you're using a supported file format
• Try submitting from a more stable internet connection

Still having problems? The support team is available Monday through Friday, 8am-6pm at studentapp@leadgroup.edu`;
    }
  }
  
  // Contact or support questions
  if (queryLower.includes('contact') || queryLower.includes('support') || queryLower.includes('help') || queryLower.includes('assistance')) {
    if (contentLower.includes('support') || contentLower.includes('contact') || contentLower.includes('help')) {
      return `Need help with the Student App? Support is available through multiple channels:

• In-app Help Center - Tap the help icon in the app menu
• Email: studentapp@leadgroup.edu
• Support Hours: Monday-Friday, 8am-6pm

The support team can help with account issues, technical problems, and general questions about using the app.`;
    }
  }
  
  // Getting started questions
  if (queryLower.includes('get started') || queryLower.includes('setup') || queryLower.includes('begin') || queryLower.includes('first time')) {
    if (contentLower.includes('getting started') || contentLower.includes('setup')) {
      return `Getting started with the Student App is easy:

1. After installing, launch the app from your home screen
2. You'll need your student ID and the activation code from your school
3. Create a secure password (8+ characters with at least one number and special character)
4. Fill out your profile details
5. You'll then see the home dashboard where you can access all your materials

The first time you log in, I recommend exploring the app menu to familiarize yourself with where everything is located. The tutorial will highlight key features automatically.`;
    }
  }
  
  // If no specific match found, provide a conversational generic response
  return `I don't have specific information about that in my current resources. 

The Student App includes features like digital textbooks, assignment tracking, progress reports, study planning, and in-app messaging with teachers.

Would you like to know more about any of these areas? Or if you have a technical issue, I can help with troubleshooting steps.`;
};