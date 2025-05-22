// app/api/ask-gemini/route.ts

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: "Question is missing" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const model = "gemini-2.5-flash-preview-04-17";
    const tools = [{ googleSearch: {} }];

    const config = {
      tools,
      responseMimeType: "text/plain",
      systemInstruction: [
        {
          text: `You are a news assistant. You will answer users' questions related to current news, breaking events, politics, economy, sports, culture, technology, and other news topics.

Provide answers based on up-to-date and accurate news information. If you have access to recent news data, respond only using that information. If you do not have current news data, politely inform the user and avoid making up information.

Answer questions clearly, simply, and objectively. Whenever possible, cite your sources.

Important: Accuracy is critical. Do not provide misleading or unverified information.`,
        },
      ],
    };

    const contents = [
      {
        role: "user",
        parts: [{ text: question }],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const anyResponse = response as any;

    let answer = "No response received.";

    if (typeof anyResponse.text === "string") {
      answer = anyResponse.text;
    } else if (typeof anyResponse.text === "function") {
      answer = await anyResponse.text();
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
