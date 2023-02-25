import React, { useState, useEffect } from "react";
import axios, { isCancel, AxiosError } from "axios";
import { Question, AnswerValues, Quiz } from "./quiz.model";
import "../../styles/global.css";
import { SERVER_URL } from "../../env.d";
import { hasAllProperties } from "./utility";

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
    const payloadToSend:Quiz = {
      name: payload.name,
      quiz_id: payload.quiz_id,
      category: payload.category,
      questions: questions,
    };
    if(!hasAllProperties(payloadToSend)){
      alert("Please fill in all the fields")
      return;
    }
    console.log(payloadToSend);
    axios
      .post(SERVER_URL + "/quizzes/create", payloadToSend)
      .then(function (response) {
        alert("upload complete")
      })
      .catch(function (error) {
        // handle error
        alert("upload failed")
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
    <div className="relative mx-auto px-4 w-1/2">
      <div className="flex flex-col justify-center m-3">
        <label className="mx-auto"  htmlFor="category">Category Name</label>
        <input
          className="mx-auto bg-grey-100 border-gray-800 border-2 w-3/4 rounded m-3"
          name="category"
          value={payload.category}
          onChange={changeCategory}
        ></input>
        <label className="mx-auto"  htmlFor="name">Quiz Name</label>
        <input
          className="mx-auto bg-grey-100 border-gray-800 border-2 w-3/4 rounded m-3"
          name="name"
          value={payload.name}
          onChange={changeCategory}
        ></input>
        <label className="mx-auto"  htmlFor="quiz_id">Quiz Id</label>
        <input
          className="mx-auto bg-grey-100 border-gray-800 border-2 w-3/4 rounded m-3"
          name="quiz_id"
          value={payload.quiz_id}
          onChange={changeCategory}
        ></input>
      </div>
      <form
        className="flex flex-col justify-center m-3 "
        onSubmit={handleFormSubmit}
      >
        <textarea
          className="mx-auto border-gray-800 border-2 active:border-green-500 bg-grey-100 w-3/4 rounded m-3"
          rows={5}
          value={inputText}
          onChange={handleInputChange}
        />
        <textarea
          className="mx-auto  border-gray-800 border-2 active:border-green-500 bg-grey-100  w-3/4 rounded m-3 "
          rows={5}
          value={questions ? JSON.stringify(questions, undefined, 2) : ""}
          onChange={handleInputChange}
        />
        <div className="flex w-1/2 mx-auto">
          <button className="mx-auto bg-white m-4 p-4 border-gray-800 border-2" type="submit">
            Parse Text
          </button>
          <button
            className="mx-auto bg-white border-grey-700 m-4 p-4 border-gray-800 border-2"
            onClick={handleUpload}
          >
            Upload Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
