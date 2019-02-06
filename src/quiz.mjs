import utils from "./utils.mjs";

export default {
  check_answer: function(answer, correct) {
    correct = correct.toLowerCase().split(";");
    return correct.includes(answer.toLowerCase());
  },

  next_question: function(questions) {
    return questions[utils.getRandom(questions.length - 1)];
  }
};
