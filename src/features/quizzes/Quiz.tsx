import React, { useState, useEffect } from "react";
import { getUrlParams } from "../../utils/urlParams";
import axios, { isCancel, AxiosError } from "axios";
import { Question, Quiz } from "./quiz.model";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  let question = questions[currentQuestion];
  let correctAnswer = question?.correctAnswer;

  useEffect(() => {
    // Get URL params
    const params = getUrlParams();
    console.log("params", params);

    // Make a request for a user with a given ID
    //?quiz_id=params.quiz_id

    axios
      .get("http://localhost/quizzes?quiz_id=${params.quiz_id}")
      .then(function (response) {
        const quiz: Quiz = response.data[0];
        const questions = quiz.questions.map(
          ({ answers, correctAnswer, question, questionNum }) => {
            return {
              questionNum,
              question,
              answers: Object.entries(answers),
              correctAnswer,
            };
          }
        );
        setQuestions(questions);
        console.log(questions);
      });
  }, []);

  const handleAnswer = (selectedAnswer) => {
    console.log("selectedAnswer", selectedAnswer);
    if (selectedAnswer == correctAnswer ) {
      setScore(score + 1);
    } else {
      let incorrectAnswers: number[] = [];
      incorrectAnswers.push(currentQuestion);
      setIncorrectAnswers(incorrectAnswers);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="mx-auto flex flex-col w-1/2 ">
      {!question ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>
            {question.questionNum} {question.question}
          </h3>
          {question.answers.map(([key, value]) => {
            return (
              <button
                key={key}
                className="border-glow bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 mb-2 rounded "
                onClick={() => handleAnswer(key)}
              >
                {value}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
