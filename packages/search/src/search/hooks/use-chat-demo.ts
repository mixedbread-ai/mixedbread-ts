import { useState, useCallback } from 'react';
import { type Message } from '../lib/types';

const demoResponses = {
  hello: 'Hello! How can I help you with the documentation today?',
  hi: "Hi there! I'm here to help you navigate and understand the documentation. What would you like to know?",
  help: 'I can help you with:\n• Finding specific documentation topics\n• Explaining API concepts\n• Providing code examples\n• Answering technical questions\n\nWhat would you like to explore?',
  search:
    'The search functionality allows you to:\n1. Search through documentation by keywords\n2. Filter results by tags\n3. Navigate directly to relevant sections\n\nYou can use the search dialog or integrate search primitives into your own UI.',
  api: 'Our API provides several endpoints:\n• `/embeddings` - Generate text embeddings\n• `/chat/completions` - Chat with AI models\n• `/files` - Upload and manage files\n• `/vector-stores` - Create and query vector databases\n\nWhich endpoint would you like to learn more about?',
  default:
    "I understand you're asking about the documentation. Could you be more specific about what you'd like to know? I can help with API references, integration guides, or code examples.",
};

function getResponse(input: string) {
  const lowerInput = input.toLowerCase();

  for (const [keyword, response] of Object.entries(demoResponses)) {
    if (keyword !== 'default' && lowerInput.includes(keyword)) {
      return response;
    }
  }

  return demoResponses.default;
}

export function useChatDemo() {
  const [thread, setThread] = useState<{
    id: string;
    messages: Message[];
  }>({
    id: '1',
    messages: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date(),
    };

    setThread((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setIsLoading(true);

    setTimeout(
      () => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: getResponse(content),
          createdAt: new Date(),
        };

        setThread((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        setIsLoading(false);
      },
      800 + Math.random() * 400,
    );
  }, []);

  return { thread, sendMessage, isLoading };
}
