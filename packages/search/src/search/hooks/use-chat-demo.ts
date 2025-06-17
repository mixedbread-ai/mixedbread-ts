import { useState, useCallback } from 'react';
import { type Message } from '../lib/types';

const demoResponses: Record<string, string> = {
  hello: 'Hello! How can I help you with the documentation today?',
  hi: "Hi there! I'm here to help you navigate and understand the documentation. What would you like to know?",
  help: `I can help you with:

• **Finding specific documentation topics**
• **Explaining API concepts**
• **Providing code examples**
• **Answering technical questions**

What would you like to explore?`,
  search: `The search functionality allows you to:

1. **Search through documentation** by keywords
2. **Filter results** by tags
3. **Navigate directly** to relevant sections

You can use the search dialog or integrate search primitives into your own UI.

### Example Usage
\`\`\`typescript
import { useSearch } from '@/search/hooks/use-search';

const { search, setSearch, results } = useSearch();
\`\`\``,
  api: `Our API provides several endpoints:

| Endpoint | Description |
|----------|-------------|
| \`/embeddings\` | Generate text embeddings |
| \`/chat/completions\` | Chat with AI models |
| \`/files\` | Upload and manage files |
| \`/vector-stores\` | Create and query vector databases |

Which endpoint would you like to learn more about?`,
  code: `Here's a simple example of how to implement semantic search:

\`\`\`typescript
// Initialize the client
const client = new MixedbreadClient({
  apiKey: process.env.MIXEDBREAD_API_KEY
});

// Generate embeddings
const response = await client.embeddings({
  model: 'mxbai-embed-large-v1',
  input: 'What is semantic search?'
});

// Use the embeddings for similarity search
const results = await searchVector(response.data[0].embedding);
\`\`\`

> **Note:** Make sure to handle errors and implement proper rate limiting in production.`,
  markdown: `## Markdown Support

This chat interface supports **full markdown** rendering including:

- **Bold** and *italic* text
- \`inline code\` snippets
- Lists (ordered and unordered)
- [Links](https://mixedbread.com)
- Code blocks with syntax highlighting
- Tables and more!

> Blockquotes

Feel free to ask questions and I'll format my responses for better readability.`,
  default: `I understand you're asking about the documentation. Could you be more specific about what you'd like to know? 

I can help with:
- **API references**
- **Integration guides**  
- **Code examples**
- **Best practices**`,
};

function getResponse(input: string) {
  const lowerInput = input.toLowerCase();

  // Check for exact matches first
  for (const [keyword, response] of Object.entries(demoResponses)) {
    if (keyword !== 'default' && lowerInput.includes(keyword)) {
      return response;
    }
  }

  // Additional keyword checks for better matching
  if (lowerInput.includes('example') || lowerInput.includes('how to')) {
    return demoResponses.code;
  }

  if (lowerInput.includes('format') || lowerInput.includes('style')) {
    return demoResponses.markdown;
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
      status: 'completed',
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date(),
    };

    const pendingMessageId = `assistant-${Date.now()}`;

    const pendingAssistantMessage: Message = {
      status: 'pending',
      id: pendingMessageId,
      role: 'assistant',
      content: '',
    };

    setThread((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage, pendingAssistantMessage],
    }));

    setIsLoading(true);

    setTimeout(
      () => {
        const assistantMessage: Message = {
          status: 'completed',
          id: pendingMessageId,
          role: 'assistant',
          content: getResponse(content),
          createdAt: new Date(),
        };

        setThread((prev) => {
          const updatedMessages = prev.messages.map((message) =>
            message.id === pendingMessageId ? assistantMessage : message,
          );

          return {
            ...prev,
            messages: updatedMessages,
          };
        });

        setIsLoading(false);
      },
      800 + Math.random() * 400,
    );
  }, []);

  return { thread, sendMessage, isLoading };
}
