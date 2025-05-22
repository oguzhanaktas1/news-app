"use client";
import { useState, useRef, useEffect } from "react";

type Message = {
  question: string;
  answer: string;
};

type Props = {
  fullPage?: boolean;
};

export default function NewsAssistant({ fullPage = false }: Props) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.error || "An error occurred";
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setHistory((prev) => [...prev, { question, answer: data.answer }]);
      setQuestion("");
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col p-2 ${
        fullPage
          ? "min-h-[80vh] px-[15vw] py-[10vh]"
          : "h-full"
      }`}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md p-2 space-y-3 text-xs sm:text-sm">
        {history.length === 0 && (
          <p className="text-center text-gray-400 mt-6">No questions yet.</p>
        )}
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-md max-w-[70%] break-words">
                <strong>You:</strong> {item.question}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded-md max-w-[70%] break-words whitespace-pre-wrap">
                <strong>News Assistant:</strong> {item.answer}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Type a question..."
          className="flex-1 border rounded-md px-2 py-1 text-xs sm:text-sm dark:bg-gray-900 dark:text-white dark:border-gray-600"
          disabled={loading}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className={`px-3 py-1 rounded-md text-xs sm:text-sm text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
