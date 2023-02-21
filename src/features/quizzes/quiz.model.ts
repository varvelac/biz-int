export interface Question {
  questionNum: number;
  question: string;
  answers: AnswerValues;
  correctAnswer: string;
}

export interface AnswerValues {
  [key: string]: string;
}

export interface Category {
    category: string;
    quizzes: Quiz[];
}

export interface Quiz {
    quiz_id: string;
    name: string;
    questions: Question[];
    category: string;

}
