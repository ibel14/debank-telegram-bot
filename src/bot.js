const TelegramBot = require('node-telegram-bot-api');
const { runGasTest, runTotalTest } = require('./tests/test.spec.js');

const token = 'YOUR_TOKEN';

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    const response = `Привет. Я предоставляю тебе данные из debank.com. Тебе достаточно отправить мне адрес кошелька, и в ответ ты получишь результат.`;
    bot.sendMessage(chatId, response);
  } else if (text === '/gas') {
    try {
      runGasTest().then((results) => {
        bot.sendMessage(chatId, results);
      });
    } catch (error) {
      console.error('Ошибка при выполнении теста:', error);
      bot.sendMessage(chatId, 'Произошла ошибка при выполнении теста.');
    }
  } else if (text === '/total') {
    try {
      runTotalTest().then((results) => {
        bot.sendMessage(chatId, results);
      });
    } catch (error) {
      console.error('Ошибка при выполнении теста:', error);
      bot.sendMessage(chatId, 'Произошла ошибка при выполнении теста.');
    }
  } else if (looksLikeWalletAddress(text)) {
    try {
      runTests(text).then((results) => {
        bot.sendMessage(chatId, results);
      });
    } catch (error) {
      console.error('Ошибка при выполнении теста:', error);
      bot.sendMessage(chatId, 'Произошла ошибка при выполнении теста.');
    }
  } else {
    bot.sendMessage(chatId, 'Введите корректный адрес кошелька Ethereum.');
  }
});

function looksLikeWalletAddress(text) {
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;
  return ethereumAddressPattern.test(text);
}

bot.startPolling();
