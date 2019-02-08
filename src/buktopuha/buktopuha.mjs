export default class Buktopuha {
  constructor(opt = {}) {
    this.questions = opt.questions;
    this.sections = [];
    this.qCount = [];

    this.questions.forEach(section => {
      this.sections.push(section.name);
      this.qCount.push(section.count);
    });

    this.questionsTotal = this.getQuestionsCount();
    this.sectionsStr = this.getSectionsStr();
  }

  getQuestionsCount() {
    return this.qCount.reduce((s, c) => {
      return (s += c);
    }, 0);
  }

  getSectionsStr() {
    const str = [];
    this.sections.forEach((name, i) => {
      str.push(`${name} (${this.qCount[i]})`);
    });
    return str.join(", ");
  }

  getHelp() {
    return `
\`kot buktopuha help\` \`(aliases: h, ?)\` -- displays all of the quiz help commands
\`kot buktopuha info\` \`(aliases: i)\` -- displays all the information about quiz: sections, question count etc.
\`kot buktopuha start [<sections>]\` -- starts the quiz; <sections> is optional; all questions available while empty <sections> \`(quiz admin command)\`
\`kot buktopuha stop\` -- stops active quiz \`(quiz admin command)\`
\`kot buktopuha question\` \`(aliases: q)\` -- repeats current question`;
  }

  getInfo() {
    return `
== Quiz info ==
Разделов: ${this.questions.length}
Всего вопросов: ${this.questionsTotal}
Разделы: ${this.sectionsStr}`;
  }
}
