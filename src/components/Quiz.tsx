import React, { useState, useEffect } from "react";
import { getUrlParams } from "../utils/urlParams";
import axios, { isCancel, AxiosError } from "axios";

export default function Quiz() {
  useEffect(() => {
    // Get URL params
    const params = getUrlParams();
    console.log("params", params);

    // Make a request for a user with a given ID
    //?quiz_id=params.quiz_id
  }, []);

  const [questions, setQuestions] = useState([
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "What is the largest country in the world?",
      options: ["Russia", "China", "USA", "Canada"],
      answer: "Russia",
    },
    // Add more questions here
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerOptionClick = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {showScore ? (
        <div className="text-center">
          <p className="text-3xl font-bold mb-4">
            You scored {score} out of {questions.length}
          </p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-3xl font-bold mb-4">
            {questions[currentQuestion].question}
          </div>
          <div className="flex flex-col">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 mb-2 rounded"
                onClick={() => handleAnswerOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
