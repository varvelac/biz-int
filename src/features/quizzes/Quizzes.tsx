import React, { useState, useEffect } from "react";
import axios, { isCancel, AxiosError } from "axios";
import { Category, Quiz, Question, AnswerValues } from "./quiz.model";
import { SERVER_URL } from "../../env.d";
import Spinner from "../../layouts/spinner";

export default function Quizzes() {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get(SERVER_URL + "/quizzes")
      .then(function (response) {
        let quizzes = response.data;

        const categoriesMap = new Map();

        quizzes.forEach((quiz) => {
          const category = quiz.category;
          quiz.href = "/cosmetology/quiz/?quiz_id=" + quiz.quiz_id;

          if (categoriesMap.has(category)) {
            categoriesMap.get(category).push(quiz);
          } else {
            categoriesMap.set(category, [quiz]);
          }
        });

        const categoriesTemp = Array.from(
          categoriesMap,
          ([category, quizzes]) => ({ category, quizzes })
        );

        setCategories(categoriesTemp);
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleAccordion = (index, event) => {
    event.preventDefault();
    console.log("toggleAccordion", index);
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className="max-w-md mx-auto">
      {categories.length === 0 && <Spinner />}
      {categories?.map((category, index) => (
        <div>
          <button
            className="btn_w_border bg-white w-full flex items-center justify-between py-2 px-4 rounded-md mb-2"
            onClick={(event) => toggleAccordion(index, event)}
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

          <ul className={`${activeIndex === index ? "block" : "hidden"} `}>
            {category.quizzes?.map((quiz) => (
              <li
                className="btn_w_border bg-white w-full flex items-center justify-between py-2 px-4 rounded-md mb-2"
                key={quiz.name}
              >
                <a className="w-full" href={quiz.href}>
                  <button className="w-full ">{quiz.name}</button>
                </a>
              </li>
            ))}
            
            <li
                className="btn_w_border bg-green-100 w-full flex items-center justify-between py-2 px-4 rounded-md mb-2"
                key={category.category}
              >
                <a className="w-full" href={"/cosmetology/quiz/?quiz_id=" + category.category + "&random=true"}>
                  <button className="w-full ">Random 110 Questions</button>
                </a>
              </li>
          </ul>
        </div>
      ))}
      {categories.length === 0? '': (
      <div className="flex ">
      <a className="flexxyButton" href={"/cosmetology/quiz/?quiz_id=new&random=true"}>
                  <button className="w-full ">Random 110 New Questions</button>
      </a>
      <a className="flexxyButton" href={"/cosmetology/quiz/?quiz_id=old&random=true"}>
                  <button className="w-full ">Random 110 Old Questions</button>
      </a>
      </div> 
      )}
      
    </div>
  );
}
