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
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(`Gemini API error: ${error.response?.status} ${error.response?.statusText}`);
  }
}
