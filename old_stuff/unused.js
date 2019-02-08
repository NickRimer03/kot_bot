/*
import Request from "request";

  const phrases = [
    ["Бесспорно", "Предрешено", "Никаких сомнений", "Определённо да", "Можешь быть уверен в этом"],
    ["Мне кажется — «да»", "Вероятнее всего", "Хорошие перспективы", "Знаки говорят — «да»", "Да"],
    [
      "Пока не ясно, попробуй снова",
      "Спроси позже",
      "Лучше не рассказывать",
      "Сейчас нельзя предсказать",
      "Сконцентрируйся и спроси опять"
    ],
    ["Даже не думай", "Мой ответ — «нет»", "По моим данным — «нет»", "Перспективы не очень хорошие", "Весьма сомнительно"]
  ];
  const hearts = ["💙", "💚", "💛", "❤"];

  if (Message.trim() == "kot" && !Game.launched) Channel.send(`${Author}: Чё хотел?`);


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
      const d20 = Utils.getRandom(20, 1);
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
        const heart = Utils.getRandom(3);
        const answer = `${Author}: ${hearts[heart]} ${phrases[heart][Utils.getRandom(4)]}`;
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
*/
