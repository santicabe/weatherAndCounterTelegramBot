require("dotenv").config();
const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const getWeather = async () => {
  let response = await fetch(process.env.API_WEATHER_URL);
  let data = await response.json();
  let tempInCelcius = Math.floor(data.main.temp - 273.17);
  let weather = data.weather[0].main.toLowerCase();

  return `The weather in Montevideo is ${weather} and the temperature is ${tempInCelcius}°C. `;
};

let counter = 0;

bot.start((ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    "Hi " + ctx.from.first_name + "! What can i do for you?",
    {
      reply_markup: {
        keyboard: [
          [
            { text: "I want to know the weather! 🌦" },
            { text: "I want to count! 🧮" },
          ],
        ],
        resize_keyboard: true,
      },
    }
  );
});

bot.hears("I want to know the weather! 🌦", async (ctx) => {
  ctx.reply(await getWeather());
});

bot.hears("I want to count! 🧮", (ctx) => {
  counter++;
  ctx.reply(counter);
});

bot.launch();
