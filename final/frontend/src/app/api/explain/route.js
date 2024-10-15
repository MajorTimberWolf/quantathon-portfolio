import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request) {
  const { stockData, optimizedWeights, investmentAmounts } =
    await request.json();

  if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_GROQ_API_KEY is required" },
      { status: 500 }
    );
  }

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const systemPrompt = `This is a portfolio optimization system that recommends investments in a set of stocks based on a given amount and risk tolerance. 
    Given the optimized weights for each stock, explain why each stock requires the specified investment amount. 
    The response must strictly be in JSON format and should not include any additional text. 
    Example: [{stock: 'AAPL', explanation: 'Apple is a leading technology company...'}].`;

  const prompt = stockData
    .map(
      (stock, index) =>
        `Explain why ${stock} requires an investment of $${investmentAmounts[
          index
        ].toFixed(2)} based on an optimized weight of ${optimizedWeights[
          index
        ].toFixed(4)}.`
    )
    .join("\n");

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama3-70b-8192",
    });

    const rawText = response.choices[0].message.content;
    console.log("Raw text:", rawText);
    console.log(typeof rawText);

    const explanations = JSON.parse(rawText);
    return NextResponse.json(explanations);
  } catch (error) {
    console.error("Error fetching explanations:", error);
    return NextResponse.json(
      { error: "Failed to fetch explanations" },
      { status: 500 }
    );
  }
}
