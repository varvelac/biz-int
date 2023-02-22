import React, { useState, useEffect } from "react";
import axios, { isCancel, AxiosError } from "axios";
import { Category, Quiz, Question, AnswerValues } from "./quiz.model";
import { QuizService } from "./quiz.service";

export default function Quizzes() {

  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    axios
    .get(
      "https://us-central1-biz-int-starship.cloudfunctions.net/api/quizzes"
    ).then(function (response) {
      // handle success
      let quizzes = response.data;
      quizzes
        .forEach((quiz) => {
          const categories: Category[] = getCategories(quiz);

          setCategories(categories);
          console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    });
  }, []);

  function getCategories(quiz: Quiz) {
    let quizObj:Quiz = {
      category: quiz.category,
      name: quiz.name,
      quiz_id: quiz.quiz_id,
      questions: quiz.questions
    }

    let targetCategory = categories.find((category) => category.category === quiz.category)
        
    if(!targetCategory) {
    categories.push(
      {
        category: quiz.category,
        quizzes: [quizObj],
      }
    );
    } else {
      targetCategory.quizzes.push(quizObj);
    }
    return categories;
  }


  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleAccordion = (index, event) => {
    event.preventDefault();
    console.log("toggleAccordion", index);
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className="max-w-md mx-auto">
      {categories.map((category, index) => (
        <div>
          <button
            className="border-glow w-1/2 sm:w-3/4 flex items-center justify-between py-2 px-4 border rounded-md mb-2 bg-gray-100 focus:outline-none"
            onMouseOver={(event) => toggleAccordion(index, event)}
          >
            <h2 className="text-lg font-medium">{category.category}</h2>
            <svg
              className={`h-5 w-5 transform ${
                activeIndex === index ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.293 6.707a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 1 1-1.414 1.414L10 4.414l-2.293 2.293a1 1 0 0 1-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <ul
            className={`${
              activeIndex === index ? "block" : "hidden"
            } px-4 mb-2 bg-gray-100 transition-all duration-500 ease-in-out border-glow border rounded-md w-1/2 sm:w-3/4`}
          >
            {category.quizzes.map((quiz) => (
              <li className="" key={quiz.name}>
                <button className="w-full">
                <a href="/cosmetology/quiz?=${quiz.quiz_id}">{quiz.name}</a></button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
