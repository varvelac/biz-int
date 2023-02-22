import React, { useState, useEffect } from "react";
import axios, { isCancel, AxiosError } from "axios";
import { Question, AnswerValues } from "./quiz.model";
import "../../styles/global.css";
import { SERVER_URL } from "../../env.d";

export default function TextParserForm() {
  const [inputText, setInputText] = useState("");
  const [questions, setQuestions] = useState<any[]>([]); // [
  const [payload, setValues] = useState({
    category: "",
    name: "",
    quiz_id: "",
  });
  const changeCategory = (e) => {
    const keyName = e.target.name;
    const myObj = {};
    myObj[keyName] = e.target.value;

    setValues({ ...payload, ...myObj });
    console.log(e);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let input = event.target[0].value;
    let formatedInput = formatText(input);
    setQuestions(formatedInput);
    console.log(formatedInput);
  };

  const handleUpload = (event) => {
    const payloadToSend = {
      name: payload.name,
      quiz_id: payload.quiz_id,
      category: payload.category,
      questions: questions,
    };
    console.log(payloadToSend);
    axios
      .post(SERVER_URL + "/quizzes/create", payloadToSend)
      .then(function (response) {})
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const formatText = (inputString) => {
    const questions: Question[] = [];
    const regex =
      /^(\d+)\.\s+(.+?):答案_+?\(([A-D])\)\s*\r?\n((?:[a-d]\).+\r?\n)+)/gm;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(inputString)) !== null) {
      const [_, questionNum, question, answer, answerOptions] = match;
      const answerValues: AnswerValues = {};
      answerOptions
        .trim()
        .split("\n")
        .forEach((option) => {
          const optionMatch = /^([a-dA-D])\)\s*(.+)$/m.exec(option);
          if (optionMatch) {
            const [_, optionValue, optionText] = optionMatch;
            answerValues[optionValue.toUpperCase()] = optionText;
          }
        });

      questions.push({
        questionNum: parseInt(questionNum),
        question: question.trim(),
        answers: answerValues,
        correctAnswer: answer.toUpperCase(),
      });
    }
    return questions;
  };

  return (
    <div className="container relative mx-auto px-4 w-1/2">
      <div className="flex flex-col justify-center m-5">
        <label className="mx-auto"  htmlFor="category">Category Name</label>
        <input
          className="mx-auto border-glow w-6/12 m-5"
          name="category"
          value={payload.category}
          onChange={changeCategory}
        ></input>
        <label className="mx-auto"  htmlFor="name">Quiz Name</label>
        <input
          className="mx-auto border-glow w-6/12 m-5"
          name="name"
          value={payload.name}
          onChange={changeCategory}
        ></input>
        <label className="mx-auto"  htmlFor="quiz_id">Quiz Id</label>
        <input
          className="mx-auto border-glow w-6/12 m-5"
          name="quiz_id"
          value={payload.quiz_id}
          onChange={changeCategory}
        ></input>
      </div>
      <form
        className="flex flex-col justify-center m-5"
        onSubmit={handleFormSubmit}
      >
        <textarea
          className="mx-auto border-glow w-6/12 m-5"
          rows={10}
          value={inputText}
          onChange={handleInputChange}
        />
        <textarea
          className="mx-auto border-glow w-6/12 m-5 "
          rows={10}
          value={questions ? JSON.stringify(questions, undefined, 2) : ""}
          onChange={handleInputChange}
        />
        <div className="block flex w-1/2 mx-auto">
          <button className="mx-auto border-glow m-4 p-4" type="submit">
            Parse Text
          </button>
          <button
            className="mx-auto border-glow m-4 p-4"
            onClick={handleUpload}
          >
            Upload Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
