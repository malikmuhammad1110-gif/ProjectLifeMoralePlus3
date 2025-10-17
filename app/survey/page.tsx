"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  "How satisfied are you with your current work life?",
  "How supported do you feel by family or close friends?",
  "How would you rate your relationship or social connection quality?",
  "How much financial stability do you currently have?",
  "How much stress do you feel on a daily basis?",
  "How meaningful do you feel your daily activities are?",
  "How satisfied are you with your physical health?",
  "How satisfied are you with your emotional health?",
  "How fulfilled do you feel in your personal growth or purpose?",
  "How would you rate your average sleep quality?",
  "How balanced is your weekly routine between work and rest?",
  "How confident do you feel about your future?",
  "How safe and comfortable do you feel in your living space?",
  "How often do you feel motivated or inspired?",
  "How well do you manage your responsibilities and time?",
  "How often do you feel joy or peace during your day?",
  "How often do you feel gratitude or appreciation?",
  "How healthy are your coping mechanisms for stress?",
  "How often do you engage in hobbies or passions?",
  "How satisfied are you with your self-discipline or focus?",
  "How well do you communicate your needs and emotions?",
  "How strong do you feel your sense of community or belonging is?",
  "How adaptable do you feel to life changes or challenges?",
  "How aligned do your daily actions feel with your values?"
];

export default function SurveyPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(24).fill(5));

  const handleChange = (index: number, value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const calculateScore = () => {
    const sum = answers.reduce((a, b) => a + b, 0);
    const avg = sum / answers.length;
    const adjusted = avg * 0.875; // scales max realistic morale to 8.75
    localStorage.setItem("lifeMoraleScore", adjusted.toFixed(2));
    router.push("/results");
  };

  return (
    <div>
      <h1>Life Morale Survey</h1>
      <p>
        Rate each question from <strong>1 (lowest)</strong> to{" "}
        <strong>10 (highest)</strong>. Be honest — this helps you understand
        your overall life morale score.
      </p>

      <div className="grid">
        {questions.map((q, i) => (
          <div key={i} className="card">
            <p><strong>{i + 1}. </strong>{q}</p>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={answers[i]}
              className="slider"
              onChange={(e) => handleChange(i, Number(e.target.value))}
            />
            <p>Your answer: {answers[i]}</p>
          </div>
        ))}
      </div>

      <button className="btn primary" onClick={calculateScore}>
        View My Results →
      </button>
    </div>
  );
}
