// Gerekli paketlerin kurulumu:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import readline from 'readline';

type Message = {
  question: string;
  answer: string;
};

const history: Message[] = [];

async function askUserInput(promptText: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function askGeminiQuestion(userInput: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const tools = [{ googleSearch: {} }];
  const config = {
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
    ],
    tools,
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `You are a news assistant. You will answer users' questions related to current news, breaking events, politics, economy, sports, culture, technology, and other news topics.

Provide answers based on up-to-date and accurate news information. If you have access to recent news data, respond only using that information. If you do not have current news data, politely inform the user and avoid making up information.

Answer questions clearly, simply, and objectively. Whenever possible, cite your sources.

Important: Accuracy is critical. Do not provide misleading or unverified information.`,
      },
    ],
  };

  const model = 'gemini-2.5-flash-preview-04-17';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: userInput,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullAnswer = '';
  for await (const chunk of response) {
    if (chunk.text !== undefined) {
      process.stdout.write(chunk.text);
      fullAnswer += chunk.text;
    }
  }

  return fullAnswer;
}

async function main() {
  console.log('📢 News Assistant | To exit: "exit"\n');

  while (true) {
    const question = await askUserInput('\nQuestion: ');

    if (question.toLowerCase() === 'exit') {
      console.log('\n🔚 Session ended.');
      break;
    }

    console.log('\nAnswer:\n');

    const answer = await askGeminiQuestion(question);

    // Geçmişe ekle
    history.push({ question, answer });

    // Kullanıcıya geçmişi gösterme seçeneği
    const showHistory = await askUserInput('\n📜 Do you want to see the past?? (y/n): ');
    if (showHistory.toLowerCase() === 'e') {
      console.log('\n🕓 Q&A History:\n');
      history.forEach((entry, index) => {
        console.log(`🟡 ${index + 1}. Question: ${entry.question}`);
        console.log(`🟢 Response:\n${entry.answer}\n`);
      });
    }
  }
}

main();