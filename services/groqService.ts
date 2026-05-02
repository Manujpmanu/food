import { MENU_ITEMS, RESTAURANTS } from '../constants';

export type AISearchResults = {
  recommendedItemIds: string[];
  nearbyRestaurantIds: string[];
};

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b';

const getGroqApiKey = () => process.env.GROQ_API_KEY;

const buildItemsContext = () =>
  MENU_ITEMS.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    restaurant: RESTAURANTS.find(r => r.id === item.restaurantId)?.name,
    isVeg: item.isVeg,
  }));

const buildRestaurantsContext = () =>
  RESTAURANTS.map(restaurant => ({
    id: restaurant.id,
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    address: restaurant.address,
    rating: restaurant.rating,
    deliveryTime: restaurant.deliveryTime,
  }));

const inferQueryHints = (query: string) => {
  const lower = query.toLowerCase();
  const budgetMatch = lower.match(/(?:under|below|within|budget of|for)\s*₹?\s*(\d+)/i);

  return {
    budget: budgetMatch ? Number(budgetMatch[1]) : null,
    spicePreference: lower.includes('spicy') ? 'spicy' : lower.includes('mild') ? 'mild' : null,
    deliveryPreference: lower.includes('fast') || lower.includes('quick') || lower.includes('soon') ? 'fast' : null,
    healthyPreference: lower.includes('healthy') || lower.includes('light') ? 'healthy' : null,
  };
};

const parseAiPayload = (content: string): AISearchResults => {
  const trimmed = content.trim().replace(/^```json\s*/i, '').replace(/```$/i, '');
  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  const jsonText = objectMatch ? objectMatch[0] : trimmed;
  const parsed = JSON.parse(jsonText);

  return {
    recommendedItemIds: Array.isArray(parsed?.recommendedItemIds)
      ? parsed.recommendedItemIds.filter((id: unknown): id is string => typeof id === 'string')
      : [],
    nearbyRestaurantIds: Array.isArray(parsed?.nearbyRestaurantIds)
      ? parsed.nearbyRestaurantIds.filter((id: unknown): id is string => typeof id === 'string')
      : [],
  };
};

export const getFoodRecommendations = async (userQuery: string, deliveryAddress = ''): Promise<AISearchResults> => {
  const apiKey = getGroqApiKey();
  const queryHints = inferQueryHints(userQuery);

  if (!apiKey) {
    console.warn('Groq API Key missing. Returning mock response.');
    return {
      recommendedItemIds: MENU_ITEMS.slice(0, 3).map(item => item.id),
      nearbyRestaurantIds: RESTAURANTS.slice(0, 3).map(restaurant => restaurant.id),
    };
  }

  const prompt = `
    You are a helpful food delivery assistant.
    User Query: "${userQuery}"
    Delivery Address: "${deliveryAddress}"
    Query Hints: ${JSON.stringify(queryHints)}

    Here is the list of available menu items:
    ${JSON.stringify(buildItemsContext())}

    Here is the list of available restaurants:
    ${JSON.stringify(buildRestaurantsContext())}

    Select up to 5 menu items and up to 4 nearby restaurants that best match the user's query, delivery address, and query hints.
    Return ONLY a JSON object with this exact shape:
    { "recommendedItemIds": ["..."], "nearbyRestaurantIds": ["..."] }
  `;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) return { recommendedItemIds: [], nearbyRestaurantIds: [] };

    return parseAiPayload(content);
  } catch (error) {
    console.error('Error fetching recommendations from Groq:', error);
    return { recommendedItemIds: [], nearbyRestaurantIds: [] };
  }
};