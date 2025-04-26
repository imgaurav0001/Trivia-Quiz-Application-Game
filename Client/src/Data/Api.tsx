// api.ts
import axios from "axios";

// Fetch quiz questions
export const fetchQuizQuestions = async (
  question: number,
  category: string
) => {
  const response = await axios.get(
    `https://opentdb.com/api.php?amount=${question}&category=${category}&type=multiple`
  );
  return response.data.results;
};

// Other API calls can be added here
