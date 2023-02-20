import React, { useState, useEffect } from "react";
import { Question, AnswerValues } from "./models/quiz.model";
import "../styles/global.css"


function TextParserForm() {

  const [inputText, setInputText] = useState("");
  const [questions, setQuestions] = useState<any[]>([]); // [

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
    <div className="container relative mx-auto px-4">
      <form
        className="flex flex-col justify-center m-5"
        onSubmit={handleFormSubmit}
      >
        <textarea
          className="mx-auto border-glow w-6/12 m-5"
          rows="10"
          value={inputText}
          onChange={handleInputChange}
        />
        <textarea
          className="mx-auto border-glow w-6/12 m-5 "
          rows="10"
          value={questions ? JSON.stringify(questions, undefined, 2) : ""}
          onChange={handleInputChange}
        />
        <button
          className="mx-auto border-glow m-5 p-5"
          type="submit"
        >
          Parse Text
        </button>
      </form>
    </div>
  );
}

export default TextParserForm;
