import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    const data = await response.json();
    console.log("AI response:", data);
    const aiText = data?.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ text: aiText });
  } catch (err) {
    console.error("Groq API error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
