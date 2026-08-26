const AIHistory = require('../models/AIHistory');
const Pet = require('../models/Pet');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const SYSTEM_PROMPT = `You are the PAWLX AI Assistant, a friendly pet-care helper embedded in a pet ecosystem app.
You help with breed information, diet planning, general wellness tips, and light symptom guidance.
CRITICAL RULES:
- Never diagnose a medical condition or claim certainty about what is wrong with a pet.
- Always recommend consulting a licensed veterinarian for anything beyond general guidance, and urge immediate in-person or emergency vet care for anything serious.
- Keep responses concise, warm, and practical.`;

const buildSystemPrompt = (pet) => {
  let prompt = SYSTEM_PROMPT;

  if (pet) {
    prompt += `\n\nYou are currently discussing this specific pet — use these details to personalize your answers:
Name: ${pet.name}
Species: ${pet.species}
Breed: ${pet.breed || 'Unknown'}
Gender: ${pet.gender}
Age: ${pet.age?.years || 0} years, ${pet.age?.months || 0} months
Weight: ${pet.weight?.value ? `${pet.weight.value}${pet.weight.unit}` : 'Not recorded'}
Known medical conditions: ${pet.medicalConditions?.length ? pet.medicalConditions.join(', ') : 'None recorded'}
Known allergies: ${pet.allergies?.length ? pet.allergies.join(', ') : 'None recorded'}
Owner notes: ${pet.ownerNotes || 'None'}`;
  }

  return prompt;
};

/**
 * Sends the conversation to the Anthropic API and returns the assistant's reply.
 * Requires ANTHROPIC_API_KEY to be set in the environment.
 */
const getAnthropicReply = async (messages, systemPrompt) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'AI Assistant request failed');
  }

  const data = await response.json();
  const textBlock = data.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : "Sorry, I couldn't generate a response. Please try again.";
};

/**
 * Sends the conversation to the Gemini API and returns the assistant's reply.
 * Requires GEMINI_API_KEY to be set in the environment.
 */
const getGeminiReply = async (messages, systemPrompt) => {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    }),
  });

  if (!response.ok) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'AI Assistant request failed');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n');
  return text || "Sorry, I couldn't generate a response. Please try again.";
};

/**
 * Simulates a pet-care AI response in offline/demo mode, using pet details
 * extracted from the system prompt to customize the answer.
 */
const getMockAIReply = async (messages, systemPrompt) => {
  const latestMessage = messages[messages.length - 1]?.content || '';
  const text = latestMessage.toLowerCase();

  // Extract pet details from system prompt
  const nameMatch = systemPrompt.match(/Name:\s*([^\n]+)/);
  const petName = nameMatch ? nameMatch[1].trim() : 'your pet';

  const speciesMatch = systemPrompt.match(/Species:\s*([^\n]+)/);
  const petSpecies = speciesMatch ? speciesMatch[1].trim().toLowerCase() : 'pet';

  const breedMatch = systemPrompt.match(/Breed:\s*([^\n]+)/);
  const petBreed = breedMatch ? breedMatch[1].trim() : '';

  let reply = '';

  if (
    text.includes('symptom') ||
    text.includes('vomit') ||
    text.includes('sick') ||
    text.includes('diarrhea') ||
    text.includes('limp') ||
    text.includes('fever') ||
    text.includes('pain') ||
    text.includes('cough')
  ) {
    reply = `Oh, I'm sorry to hear that ${petName} is not feeling well. 

As an AI assistant, I want to emphasize that **I cannot diagnose medical conditions or provide treatment plans**. Because ${
      petSpecies === 'dog' ? 'dogs' : petSpecies === 'cat' ? 'cats' : 'pets'
    } can mask symptoms, and things like lethargy, vomiting, or breathing changes can escalate quickly, I highly recommend consulting a licensed veterinarian as soon as possible.

In the meantime:
1. Keep ${petName} in a quiet, comfortable space.
2. Ensure they have access to fresh water, but do not force them to drink or eat.
3. Keep a close log of when the symptoms started and how frequent they are so you can share this with your vet.

For professional care, you can book an appointment with our featured vets like Dr. Kavita Rao directly through the **Vets** booking tab in the app!`;
  } else if (
    text.includes('food') ||
    text.includes('diet') ||
    text.includes('eat') ||
    text.includes('meal') ||
    text.includes('nutrition') ||
    text.includes('hungry')
  ) {
    reply = `Nutrition is key to keeping ${petName} healthy and active! Since ${petName} is a ${
      petBreed || petSpecies
    }, here are some general diet planning tips:

1. **Balanced Portions**: A ${
      petBreed || petSpecies
    } typically thrives on high-quality commercial feed or balanced home-cooked diets formulated specifically for their size and life stage.
2. **Allergies & Conditions**: Always keep in mind any allergies or sensitive stomach signs. If ${petName} has any medical conditions, veterinary prescription diets are often best.
3. **Hydration**: Ensure fresh water is always available. If ${petName} is a cat, wet food can help increase their daily moisture intake.
4. **Treats**: Limit treats to no more than 10% of their daily caloric intake to prevent obesity.

If you'd like to purchase premium food, treats, or supplements, feel free to browse the PAWLX **Marketplace**!`;
  } else if (
    text.includes('breed') ||
    text.includes('info') ||
    text.includes('tell me about') ||
    text.includes('history')
  ) {
    reply = `I'd love to tell you more! ${petName} is listed as a ${petBreed || petSpecies}.

Here are some interesting details about the ${petBreed || petSpecies} breed group:
- **Temperament**: They are typically known for being wonderful companions when given the right mental and physical stimulation.
- **Grooming Needs**: Depending on coat length, regular brushing is essential to prevent matting and minimize shedding. Feel free to check out the **Grooming** tab in the app to book professional styling!
- **Exercise**: Regular daily walks and interactive play sessions (like puzzle toys or fetch) are great for keeping them happy and out of mischief.`;
  } else {
    reply = `Hello! I am the PAWLX AI Pet Assistant. I am currently running in a simulated offline demo mode, but I can still help you with general guidance for ${petName}! 

Since ${petName} is a lovely ${petBreed || petSpecies}, here is a quick pet-care tip: 
- Regular mental stimulation, consistency in feeding times, and routine checkups (which you can track on the **Calendar** tab) are the foundations of a happy pet-care journey.

What else would you like to know about caring for ${petName}? I can help with diet planning, general wellness, or grooming tips!`;
  }

  // Simulate a slight delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return `[Offline Demo Mode] ${reply}`;
};

/**
 * Routes to whichever AI provider is configured via AI_PROVIDER ('anthropic' | 'gemini').
 * Defaults to Anthropic. Falls back to a mock reply if keys are missing or invalid, or if the API call fails.
 */
const getAIReply = async (messages, systemPrompt) => {
  const provider = (process.env.AI_PROVIDER || 'anthropic').toLowerCase();

  if (provider === 'gemini') {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return getMockAIReply(messages, systemPrompt);
    }
    try {
      return await getGeminiReply(messages, systemPrompt);
    } catch (error) {
      console.error('Gemini API call failed, falling back to mock reply:', error);
      return getMockAIReply(messages, systemPrompt);
    }
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key') {
    return getMockAIReply(messages, systemPrompt);
  }
  try {
    return await getAnthropicReply(messages, systemPrompt);
  } catch (error) {
    console.error('Anthropic API call failed, falling back to mock reply:', error);
    return getMockAIReply(messages, systemPrompt);
  }
};

const sendMessage = async (userId, { petId, topic, content, historyId }) => {
  let history;

  if (historyId) {
    history = await AIHistory.findOne({ _id: historyId, user: userId });
    if (!history) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Conversation not found');
  } else {
    history = await AIHistory.create({ user: userId, pet: petId, topic: topic || 'general', messages: [] });
  }

  history.messages.push({ role: 'user', content });

  let pet = null;
  if (history.pet) {
    pet = await Pet.findOne({ _id: history.pet, owner: userId });
  }

  const reply = await getAIReply(history.messages, buildSystemPrompt(pet));
  history.messages.push({ role: 'assistant', content: reply });

  await history.save();
  return history;
};

const getMyConversations = async (userId) =>
  AIHistory.find({ user: userId }).sort({ updatedAt: -1 }).limit(20);

const getConversationById = async (id, userId) => {
  const history = await AIHistory.findOne({ _id: id, user: userId });
  if (!history) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Conversation not found');
  return history;
};

module.exports = { sendMessage, getMyConversations, getConversationById };
