import React, { useState, useEffect } from "react";
import { getUrlParams } from "../../utils/urlParams";
import axios, { isCancel, AxiosError } from "axios";
import { Question, Quiz } from "./quiz.model";
import { SERVER_URL } from "../../env.d";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const answerMap = {
    A:0,
    B:1,
    C:2,
    D:3
  }
  let question = questions[currentQuestion];
  let correctAnswer = question?.correctAnswer;


  useEffect(() => {
    // Get URL params
    const params = getUrlParams();
    console.log("params", params);

    // Make a request for a user with a given ID
    //?quiz_id=params.quiz_id

    axios
      .get(SERVER_URL + "/quizzes?quiz_id=${params.quiz_id}")
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
      setIncorrectAnswers(incorrectAnswers => [...incorrectAnswers, currentQuestion]);
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
      {showScore ? (
        <>
        <div className="relative">
        <h3 className="font-semibold mb-8">
        {score} out of  {questions.length} correct - {Math.round(score/ questions.length * 100)}% 
        </h3>
       {incorrectAnswers.map((incorrectAnswer) => {
          return (
            <div>
            <h4 className="font-semibold">
              {questions[incorrectAnswer].questionNum} : {questions[incorrectAnswer].question}
            </h4>
            {/* holy moly, please fix this soon! */}
             <p> {questions[incorrectAnswer].answers[answerMap[questions[incorrectAnswer].correctAnswer]]} </p>
             </div>
          )
       })} 
       <button className="btn_w_border fixed bottom-12 left-1/4 mx-auto w-1/2"><a href="/cosmetology/quizzes">Return home</a></button>
       </div>
       
      </>
      ) : ( !question ? (
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
      ))}
    </div>
  );
}
