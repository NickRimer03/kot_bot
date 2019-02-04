const Utils = require("./utils.js");

exports.check_answer = function(answer, correct) {
  correct = correct.toLowerCase().split(";");
  return correct.includes(answer.toLowerCase());
};

exports.next_question = function(questions) {
  return questions[Utils.getRandom(questions.length - 1)];
};
