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
      .get("https://us-central1-biz-int-starship.cloudfunctions.net/api/quizzes?quiz_id=${params.quiz_id}")
      .then(function (response) {
        const quiz: Quiz = response.data[0];
        const questions = quiz.questions.map(
          ({ answers, correctAnswer, question, questionNum }, index) => {
            return {
              index,
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
    <div className="mx-auto flex flex-col sm:w-3/4 md:w-3/4 lg:w-1/2 p-8 ">
      {!question ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3 className="mb-5">
            {question.questionNum} : {question.question}
          </h3>
          {question.answers.map(([key, value]) => {
            return (
              <button
                key={key}
                className="btn_w_border"
                onClick={() => handleAnswer(key)}>
               {key} : {value}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
