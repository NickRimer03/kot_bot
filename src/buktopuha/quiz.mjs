import Buktopuha from "./buktopuha";
import questions from "../../res/questions.mjs";
import utils from "../../src/utils.mjs";

class Quiz {
  constructor() {
    this.launched = false;
    this.onQuestion = false;
    this.activeSections = [];
    this.currentQuestion = null;
    this.timeout = null;
    this.TIMEOUT = 30000;
    this.buktopuha = new Buktopuha({ questions });
  }

  checkAnswer(answer, correctStr) {
    const correctArr = correctStr.toLowerCase().split(";");

    return correctArr.includes(answer.toLowerCase());
  }

  nextQuestion(availableQuestions) {
    return availableQuestions[utils.getRandom(availableQuestions.length - 1)];
  }

  questionOnBoard(channel, client) {
    const question = this.getQuestion();
    channel.send(`====================\n${question.text}`);
    this.timeout = client.setTimeout(() => {
      this.onQuestion = false;
      channel.send(`Никто не ответил на вопрос :( Правильный ответ: ${question.answers.split(";")[0]}`);
      console.log(`-- no answer :( correct answer: ${question.answers.split(";")[0]} --`);
      this.questionOnBoard(channel, client);
    }, this.TIMEOUT);
    this.onQuestion = true;
    console.log("-- ==================== --");
    console.log(`-- question: ${question.text} --`);
  }

  getQuestion() {
    const rnd = utils.getRandom(this.activeSections.length - 1);
    const sect = this.activeSections[rnd];

    return (this.currentQuestion = this.nextQuestion(
      this.buktopuha.questions.filter(obj => {
        return obj.name == sect;
      })[0].questions
    ));
  }
}

export default Quiz;
