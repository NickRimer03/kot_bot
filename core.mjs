import Discord from "discord.js";
import Request from "request";
import Config from "./config.json";
import Quiz from "./src/quiz.mjs";
import Utils from "./src/utils.mjs";
import questions from "./res/questions.mjs";

const Buktopuha = {
  questions,
  sections: [],
  qCount: [],
  inProcess: false,
  onQuestion: false,
  active_sections: [],
  current_question: null,
  timeout: null,
  TIMEOUT: 30000
};
Buktopuha.questions.forEach(section => {
  Buktopuha.sections.push(section.name);
  Buktopuha.qCount.push(section.count);
});

const Client = new Discord.Client();

const phrases = [
  [
    "Бесспорно",
    "Предрешено",
    "Никаких сомнений",
    "Определённо да",
    "Можешь быть уверен в этом"
  ],
  [
    "Мне кажется — «да»",
    "Вероятнее всего",
    "Хорошие перспективы",
    "Знаки говорят — «да»",
    "Да"
  ],
  [
    "Пока не ясно, попробуй снова",
    "Спроси позже",
    "Лучше не рассказывать",
    "Сейчас нельзя предсказать",
    "Сконцентрируйся и спроси опять"
  ],
  [
    "Даже не думай",
    "Мой ответ — «нет»",
    "По моим данным — «нет»",
    "Перспективы не очень хорошие",
    "Весьма сомнительно"
  ]
];
const hearts = ["💙", "💚", "💛", "❤"];

function getQuestion() {
  const rnd = Utils.getRandom(Buktopuha.active_sections.length - 1);
  const _sect = Buktopuha.active_sections[rnd];

  return (Buktopuha.current_question = Quiz.next_question(
    Buktopuha.questions.filter(obj => {
      return obj.name == _sect;
    })[0].questions
  ));
}

function questionOnBoard(Channel) {
  const question = getQuestion();
  Channel.send(`====================\n${question.text}`);
  Buktopuha.timeout = Client.setTimeout(() => {
    Buktopuha.onQuestion = false;
    Channel.send(
      `Никто не ответил на вопрос :( Правильный ответ: ${
        question.answers.split(";")[0]
      }`
    );
    console.log(
      `-- no answer :( correct answer: ${question.answers.split(";")[0]} --`
    );
    questionOnBoard(Channel);
  }, Buktopuha.TIMEOUT);
  Buktopuha.onQuestion = true;
  console.log("-- ==================== --");
  console.log(`-- question: ${question.text} --`);
}

Client.on("ready", () => {
  console.log("Kot is ready to meow!");
});

Client.on("message", message => {
  const Author = message.author;
  const Channel = message.channel;
  const Message = message.content;
  let Protected = false;

  if (Author.bot) return;

  if (Message.trim() == "kot" && !Buktopuha.inProcess)
    Channel.send(`${Author}: Чё хотел?`);

  if (!Message.startsWith(Config.prefix)) {
    if (Buktopuha.onQuestion)
      if (Quiz.check_answer(Message, Buktopuha.current_question.answers)) {
        Client.clearTimeout(Buktopuha.timeout);
        Buktopuha.onQuestion = false;
        Channel.send(`${Author}: И это правильный ответ!`);
        console.log(
          `-- correct answer! author: ${Author}, answer: ${Message} --`
        );
        questionOnBoard(Channel);
      }
    return;
  }

  const args = Message.slice(Config.prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (Buktopuha.inProcess && !["b", "buktopuha"].includes(cmd)) return;
  if (
    Buktopuha.inProcess &&
    ["b", "buktopuha"].includes(cmd) &&
    !["stop", "q", "question"].includes(args[0])
  )
    return;

  // PROTECTED COMMANDS
  if (Config.ownerID.includes(Author.id)) {
    switch (cmd) {
      case "c":
      case "clr":
      case "clean":
      case "clear":
        Channel.bulkDelete(100).then(() => {
          Channel.send("Почистил лоток.");
          console.log("-- cat litter box cleaned --");
        });
        Protected = true;
        break;

      case "b":
      case "buktopuha":
        switch (args[0]) {
          case "start":
            if (!Buktopuha.inProcess) {
              let Start = false;
              let section =
                args[1] == null ? Buktopuha.sections : args[1].toLowerCase();

              if (args[1] == null) {
                Channel.send("Играем со всеми разделами.");
                Start = true;
                console.log("-- buktopuha start: all --");
              } else if (Buktopuha.sections.includes(section)) {
                Channel.send(`Играем в раздел ${section}`);
                Start = true;
                console.log(`-- buktopuha start: ${section} --`);
              } else {
                Channel.send("Указанный игровой раздел отсутствует.");
                console.log(
                  `-- buktopuha start error: no section \`${section}\` --`
                );
              }

              if (Start) {
                if (!(section instanceof Array)) section = [section];
                [Buktopuha.inProcess, Buktopuha.active_sections] = [
                  true,
                  section
                ];
                questionOnBoard(Channel);
              }
            }
            Protected = true;
            break;

          case "stop":
            if (Buktopuha.inProcess) {
              Channel.send("Игра остановлена.");
              [
                Buktopuha.inProcess,
                Buktopuha.onQuestion,
                Buktopuha.active_sections
              ] = [false, false, ""];
              Client.clearTimeout(Buktopuha.timeout);
              console.log("-- buktopuha stop --");
            }
            Protected = true;
            break;
        }
        break;
    }
  }
  if (Protected) return;

  // COMMON COMMANDS
  switch (cmd) {
    case "?":
    case "h":
    case "help":
      Channel.send(`
\`kot help\` \`(aliases: h, ?)\` -- displays all of the help commands
\`kot ping\` -- reply with pong!
\`kot pong\` -- reply with ping!
\`kot echo <text>\` -- reply back with <text>
\`kot meow\` \`(aliases: m, it)\` -- show random cat
\`kot d20\` -- rolls d20 dice
\`kot ball8 <question>\` \`(aliases: b8)\` -- gives you an answer with magic ball
\`kot clean\` \`(aliases: c, clr, clear)\` -- deletes last 100 messages \`(protected command)\`
      `);
      console.log("-- HELP! --");
      break;

    case "ping":
      Channel.send("pong!");
      console.log("-- ping? pong! --");
      break;

    case "pong":
      Channel.send("ping!");
      console.log("-- pong? ping! --");
      break;

    case "id":
      Channel.send(Author.id);
      break;

    case "m":
    case "it":
    case "meow":
      Request(
        { url: "http://aws.random.cat/meow", json: true },
        (error, response, body) => {
          Channel.send(body);
          console.log("-- cat showed --");
        }
      );
      break;

    case "echo":
      Channel.bulkDelete(1).then(() => {
        Channel.send(args.join(" "));
        console.log(`-- echo: ${args.join(" ")} --`);
      });
      break;

    case "d20":
      const d20 = Utils.getRandom(20, 1);
      Channel.send(d20);
      console.log(`-- d20 roll: ${d20} --`);
      break;

    case "b8":
    case "ball8":
      const question = args.join(" ").trim();
      const sign = question.match(/\?+$/);
      if (
        args.length == 0 ||
        sign == null ||
        sign[0].length == question.length
      ) {
        Channel.send(`${Author}: А где, собственно, вопрос?`);
        console.log(
          `-- question: ${question}, sign: ${sign} == no question --`
        );
      } else {
        const heart = Utils.getRandom(3);
        const answer = `${Author}: ${hearts[heart]} ${
          phrases[heart][Utils.getRandom(4)]
        }`;
        Channel.send(answer);
        console.log(`-- ${question} ${answer} --`);
      }
      break;

    case "b":
    case "buktopuha":
      if (args.length == 0) args.push("?");

      switch (args[0]) {
        case "?":
        case "h":
        case "help":
          Channel.send(`
\`kot buktopuha [<arguments>]\` \`(aliases: b)\` -- set <arguments> to play kot quiz! Shows help if no <arguments>.
\`kot buktopuha help\` \`(aliases: h, ?)\` -- displays all of the quiz help commands
\`kot buktopuha info\` \`(aliases: i)\` -- displays all information about quiz: sections, question count etc.
\`kot buktopuha start [<sections>]\` -- starts the quiz; <sections> is optional; all questions available while empty <sections> \`(protected command)\`
\`kot buktopuha stop\` -- stops the quiz \`(protected command)\`
\`kot buktopuha question\` \`(aliases: q)\` -- repeats current question
          `);
          break;

        case "i":
        case "info":
          const str = [];
          Buktopuha.sections.forEach((name, i) => {
            str.push(`${name} (${Buktopuha.qCount[i]})`);
          });
          Channel.send(`
== buktopuha info ==
Разделов: ${Buktopuha.questions.length}
Всего вопросов: ${Buktopuha.qCount.reduce((sum, current) => {
            return (sum += current);
          }, 0)}
Разделы: ${str.join(", ")}
          `);
          break;

        case "q":
        case "question":
          if (Buktopuha.onQuestion) {
            Channel.send(Buktopuha.current_question.text);
            console.log("-- buktopuha: question repeat --");
          }
          break;

        // PROTECTED COMMAND TRYING
        case "start":
        case "stop":
          Channel.send(`${Author}: нет прав доступа к данной команде.`);
          console.log(
            `-- buktopuha: unauthorized, command: ${cmd}, arguments: ${args} --`
          );
          break;

        default:
          Channel.send("Неизвестная команда викторины.");
          console.log(
            `-- buktopuha: unknown command ${cmd}, arguments: ${args} --`
          );
      }
      break;

    // PROTECTED COMMAND TRYING
    case "c":
    case "clr":
    case "clean":
    case "clear":
      Channel.send(`${Author}: руки прочь от моей сметанки!`);
      console.log("-- sour cream was in danger --");
      break;

    // UNKNOWN COMMAND
    default:
      Channel.send(`${Author}: отстань, не мешай работать!`);
      console.log(`-- unknown command: ${cmd}, arguments: ${args} --`);
  }
});

Client.login(process.argv[2] || process.env.BOT_TOKEN);
