import { Question, Quiz } from './quiz.model';



export function hasAllProperties(obj: any): obj is Quiz {
  return 'category' in obj && typeof obj.category === 'string' && obj.category  !== ''
      && 'quiz_id' in obj && typeof obj.quiz_id === 'string' && obj.quiz_id  !== ''
      && 'name' in obj && typeof obj.name === 'string' && obj.name  !== ''
      && 'questions' in obj && Array.isArray(obj.questions) && obj.questions.length !== 0//typeof obj.questions === 'Array';
}