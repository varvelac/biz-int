import React, { useState, useEffect } from "react";
import { getUrlParams } from "../../utils/urlParams";
import axios, { isCancel, AxiosError } from "axios";
import { Question, Quiz } from "./quiz.model";
import { SERVER_URL } from "../../env.d";
import "../../styles/global.css";
import { TiArrowSyncOutline } from "react-icons/ti/index.js";
import Spinner from "../../layouts/spinner";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const answerMap = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
  };
  let question = questions[currentQuestion];
  let correctAnswer = question?.correctAnswer;

  useEffect(() => {
    // Get URL params
    const params = getUrlParams();

    console.log(params);

    // Make a request for a user with a given ID
    //?quiz_id=params.quiz_id

    axios
      .get(SERVER_URL + "/quizzes/" + params.quiz_id)
      .then(function (response) {
        const quiz: Quiz = response.data;
        setTitle(quiz.name);
        const questions = quiz.questions.map(
          ({ answers, correctAnswer, question, questionNum }, index) => {
            return {
              index,
              questionNum,
              question,
              answers: Object.entries(answers),
              correctAnswer,
              // fullCorrectAnswer: answers[correctAnswer]
            };
          }
        );
        setQuestions(questions);
        console.log(questions);
      });
  }, []);

  const handleAnswer = (selectedAnswer) => {
    console.log("selectedAnswer", selectedAnswer);
    if (selectedAnswer == correctAnswer) {
      setScore(score + 1);
    } else {
      setIncorrectAnswers((incorrectAnswers) => [
        ...incorrectAnswers,
        currentQuestion,
      ]);
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
      {!question ? (<Spinner />) : (
        <div className="pb-5">

          <h5 className="mb-3 font-light text-sm">
            {title}
          </h5>
          <h1 className=" text-center text-black">
            {currentQuestion + 1} of {questions.length} questions
          </h1>
          <div className="mt-3 mx-auto h-3 relative max-w-xl rounded-sm overflow-hidden">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              id="progress-bar"
              className="transition-all ease-out duration-1000 h-full bg-gradient-to-r bg-blue-400  relative"
              style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            ></div>
          </div>

        </div>
      )}


      {showScore ? (
        <>
          <div className="relative">
            <h3 className="font-semibold mb-8">
              {score} out of {questions.length} correct -{" "}
              {Math.round((score / questions.length) * 100)}%
            </h3>
            {incorrectAnswers.map((incorrectAnswer) => {
              return (
                <div className="mb-5">
                  <h4 className="font-semibold">
                    {questions[incorrectAnswer].questionNum} :{" "}
                    {questions[incorrectAnswer].question}
                  </h4>
                  {/* holy moly, please fix this soon! */}
                  <p>
                    {" "}
                    {
                      questions[incorrectAnswer].answers[
                      answerMap[questions[incorrectAnswer].correctAnswer]
                      ]
                    }{" "}
                  </p>
                </div>
              );
            })}
            <a className="fixed left-1/2 transform -translate-x-1/2 bottom-10 left-7/8 mx-auto w-1/8;" href="/cosmetology/quizzes">
              <button className="btn_w_border  bg-red-500 active:animate-ping">
                <TiArrowSyncOutline size="30" className="text-orange-300" />
              </button>
            </a>
          </div>
        </>
      ) : !question ? (
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
                className="btn_w_border text-left bg-white"
                onClick={() => handleAnswer(key)}
              >
                {key} : {value}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
