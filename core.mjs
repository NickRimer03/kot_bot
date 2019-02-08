import Discord from "discord.js";
import Config from "./config.json";
import Quiz from "./src/buktopuha/quiz.mjs";

const Client = new Discord.Client();
const Game = new Quiz();

Client.on("ready", () => {
  console.log("Kot is ready to meow!");
});

Client.on("message", message => {
  const { author, channel, content } = message;
  let Protected = false;

  if (author.bot) return;

  if (!content.startsWith(Config.prefix)) {
    if (Game.onQuestion) {
      if (Game.checkAnswer(content, Game.currentQuestion.answers)) {
        Client.clearTimeout(Game.timeout);
        Game.onQuestion = false;
        channel.send(`${author}: И это правильный ответ!`);
        console.log(`-- correct answer! author: ${author}, answer: ${message} --`);
        Game.questionOnBoard(channel, Client);
      }
    }

    return;
  }

  const args = content
    .slice(Config.prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (Game.inProcess && !["b", "buktopuha"].includes(cmd)) return;
  if (Game.inProcess && ["b", "buktopuha"].includes(cmd) && !["stop", "q", "question"].includes(args[0])) return;

  // PROTECTED COMMANDS
  if (Config.ownerID.includes(author.id)) {
    switch (cmd) {
      case "c":
      case "clr":
      case "clean":
      case "clear":
        channel.bulkDelete(100).then(() => {
          channel.send("Почистил лоток.");
          console.log("-- cat litter box cleaned --");
        });
        Protected = true;
        break;

      case "b":
      case "buktopuha":
        switch (args[0]) {
          case "start":
            if (!Game.inProcess) {
              let Start = false;
              let section = args[1] == null ? Game.buktopuha.sections : args[1].toLowerCase();

              if (args[1] == null) {
                channel.send("Играем со всеми разделами.");
                Start = true;
                console.log("-- buktopuha start: all --");
              } else if (Game.buktopuha.sections.includes(section)) {
                channel.send(`Играем в раздел ${section}`);
                Start = true;
                console.log(`-- buktopuha start: ${section} --`);
              } else {
                channel.send("Указанный игровой раздел отсутствует.");
                console.log(`-- buktopuha start error: no section \`${section}\` --`);
              }

              if (Start) {
                if (!(section instanceof Array)) section = [section];
                [Game.inProcess, Game.activeSections] = [true, section];
                Game.questionOnBoard(channel, Client);
              }
            }
            Protected = true;
            break;

          case "stop":
            if (Game.inProcess) {
              channel.send("Игра остановлена.");
              [Game.inProcess, Game.onQuestion, Game.activeSections] = [false, false, ""];
              Client.clearTimeout(Game.timeout);
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
      channel.send(`
\`kot help\` \`(aliases: h, ?)\` -- displays all of the help commands
\`kot ping\` -- reply with pong!
\`kot id\` -- shows authors ID!
\`kot buktopuha [<arguments>]\` \`(aliases: b)\` -- set <arguments> to play kot quiz! Shows quiz help if no <arguments>.
      `);
      console.log("-- HELP! --");
      break;

    case "ping":
      channel.send("pong!");
      console.log("-- ping? pong! --");
      break;

    case "id":
      channel.send(author.id);
      break;

    case "b":
    case "buktopuha":
      if (args.length == 0) args.push("?");

      switch (args[0]) {
        case "?":
        case "h":
        case "help":
          channel.send(Game.buktopuha.getHelp());
          break;

        case "i":
        case "info":
          channel.send(Game.buktopuha.getInfo());
          break;

        case "q":
        case "question":
          if (Game.onQuestion) {
            channel.send(Game.currentQuestion.text);
            console.log("-- buktopuha: question repeat --");
          }
          break;

        // PROTECTED COMMAND TRYING
        case "start":
        case "stop":
          channel.send(`${author}: нет прав доступа к данной команде.`);
          console.log(`-- buktopuha: unauthorized, command: ${cmd}, arguments: ${args} --`);
          break;

        default:
          channel.send("Неизвестная команда викторины.");
          console.log(`-- buktopuha: unknown command ${cmd}, arguments: ${args} --`);
      }
      break;
  }
});

Client.login(process.argv[2] || process.env.BOT_TOKEN);
