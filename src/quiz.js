function getRandom (max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandom = getRandom;

exports.check_answer = function (answer, correct) {
  correct = correct.toLowerCase().split(";");
  return correct.includes(answer.toLowerCase());
}

exports.next_question = function (questions) {
  return questions[getRandom(questions.length - 1)];
}
