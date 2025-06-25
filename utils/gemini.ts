import axios from 'axios';

export async function callGeminiAPI(prompt: string, token: string) {
  const endpoint = 'https://intertest.woolf.engineering/invoke';
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: process.env.WOOLF_GEMINI_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    const candidates = response.data.candidates;
    let jsonResponse = {
      alignmentScore: 0,
      strengths: [],
      weaknesses: [],
      summary: 'Failed to parse AI response.'
    }
    if (candidates) {
      const text = candidates[0].content.parts[0].text
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      jsonResponse = JSON.parse(text.substring(jsonStart, jsonEnd));
    }
    return jsonResponse;
  } catch (error: any) {
    throw new Error(`Gemini API error: ${error.response?.status} ${error.response?.statusText}`);
  }
}
