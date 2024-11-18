import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function generateThreadFromContent(content: string) {
  const prompt = `
    Create a Twitter thread from the following content.
    Each tweet should be under 280 characters and naturally flow together.
    Focus on the key insights and maintain an engaging tone.
    Format as a JSON array of tweet objects.
    Content: ${content}
  `;

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: prompt
    }],
    response_format: { type: 'json' }
  });

  return JSON.parse(response.content[0].text) as ThreadSegment[];
}