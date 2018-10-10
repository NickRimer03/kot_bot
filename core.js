const Discord = require("discord.js");
const Config = require("./config.json");
const Request = require("request");

const Client = new Discord.Client();

const phrases = [
  ["Бесспорно", "Предрешено", "Никаких сомнений", "Определённо да", "Можешь быть уверен в этом"],
  ["Мне кажется — «да»", "Вероятнее всего", "Хорошие перспективы", "Знаки говорят — «да»", "Да"],
  ["Пока не ясно, попробуй снова", "Спроси позже", "Лучше не рассказывать", "Сейчас нельзя предсказать", "Сконцентрируйся и спроси опять"],
  ["Даже не думай", "Мой ответ — «нет»", "По моим данным — «нет»", "Перспективы не очень хорошие", "Весьма сомнительно"]
];
const hearts = ["💙", "💚", "💛", "❤"];

function getRandom (max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Client.on("ready", () => {
  console.log("Kot is ready to meow!");
});

Client.on("message", (message) => {
  const Author = message.author;
  const Channel = message.channel;
  let Protected = false;

  if (message.content.trim() == "kot" && !Author.bot)
    Channel.send(`${Author}: Чё хотел?`);

  if (!message.content.startsWith(Config.prefix) || Author.bot)
    return

  const args = message.content.slice(Config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  // PROTECTED COMMANDS
  if (Author.id == Config.ownerID) {
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
    }
  }
  if (Protected)
    return

  // COMMON COMMANDS
  switch (cmd) {
    case "help":
      Channel.send(`
\`kot help\` -- displays all of the help commands
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

    case "m":
    case "it":
    case "meow":
      Request({ url: "http://aws.random.cat/meow", json: true }, (error, response, body) => {
        Channel.send(body);
        console.log("-- cat showed --");
      });
      break;

    case "echo":
      Channel.bulkDelete(1).then(() => {
        Channel.send(args.join(" "));
        console.log(`-- echo: ${args.join(" ")} --`);
      });
      break;

    case "d20":
      const d20 = getRandom(20, 1);
      Channel.send(d20);
      console.log(`-- d20 roll: ${d20} --`);
      break;

    case "b8":
    case "ball8":
      const question = args.join(" ").trim();
      const sign = question.match(/\?+$/);
      if (args.length == 0 || sign == null || sign[0].length == question.length) {
        Channel.send(`${Author}: А где, собственно, вопрос?`);
        console.log(`-- question: ${question}, sign: ${sign} == no question --`);
      } else {
        const heart = getRandom(3);
        const answer = `${Author}: ${hearts[heart]} ${phrases[heart][getRandom(4)]}`;
        Channel.send(answer);
        console.log(`-- ${question} ${answer} --`);
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

Client.login(Config.token);
