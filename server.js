const stickers = [
    'CAACAgIAAxkBAAEEDm9iItoWcoc5lxMFwiu2gk_QlwABinYAAnoEAALMVEkJXcHMrX4DKO8jBA',
    'CAACAgIAAxkBAAEEDnFiItoiBMzbWHZr8AG-m12dWok3RAACfgQAAsxUSQmxTXJX9LxBBCME',
    'CAACAgIAAxkBAAEEDnNiItos-VSnO3OLwcywrLLjIrDf5AACewQAAsxUSQk6VE9P-QJDoSME',
    'CAACAgIAAxkBAAEEDnViIto6wQcihs4ajWnRklZ4AAF_TYwAAnwEAALMVEkJwXgbC0G68SMjBA',
    'CAACAgIAAxkBAAEEDnliItpDYT4n_AnBSK0r_iXanifXOAACjwQAAsxUSQn92wdzF-1GJyME',
    'CAACAgIAAxkBAAEEDn1iItpRa4UF4fui5Ov2Bn-unB5LAQACiAQAAsxUSQmj9-8PY4OsjyME',
    'CAACAgIAAxkBAAEEDoViItqpKR1i7PAJv-zFbOugvF4QoAACdgIAAlIU4QpLm0CaxoKeCSME',
    'CAACAgIAAxkBAAEEDoliItrBL-KkSSgt_72-6YVl96l7_QACiwIAAlIU4Qr_y2eZDBcD5iME',
    'CAACAgIAAxkBAAEEDo1iItrQJokF4yy-ElCgpD2XdmOOWAACewIAAlIU4Qpa0XsbnRiDbSME',
    'CAACAgIAAxkBAAEEDo9iItrd03o1otcCJEJcd_MnPK2wXQACaQIAAlIU4Qood9RPLjaxviME',
    'CAACAgIAAxkBAAEEDpFiItrrUpO08EL1OIeJ0vbLp9peyQACawIAAlIU4QrLvugy0QKTYCME',
    'CAACAgIAAxkBAAEEDpNiItr2i-AXXZX2U-Bgxqr8lrCGHAACdQIAAlIU4QpTviJUOA2SRSME'
];

require('dotenv').config();
// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');

// create an instance of express to serve our end points
const app = express();

// we'll load up node's built in file system helper library here
// (we'll be using this later to serve our JSON files
const fs = require('fs');

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app, fs);

// finally, launch our server on port 3001.
const server = app.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});


const TelegramBot = require('node-telegram-bot-api');
const mc = require("./memcachier");

// replace the value below with the Telegram token you receive from @BotFather
const token = '5150590347:AAGSGcdYlMXN9_XsJAKle1mufW6RykLSq7s';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/total_match (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    let resp = match[1]; // the captured "whatever"

    if (resp === 'today') {
        const now = new Date();
        resp =  now.getUTCFullYear() + '-' + now.getUTCDate() + '-' + (now.getUTCMonth() + 1);
    }

    mc.get(resp, function(err, val) {
        if(err != null) {
            bot.sendSticker(chatId, "CAADBQAD8wADDxXNGeYW5EDuT_6aAg");
        }
        else {
            if (val != null) {
                // send back the matched "whatever" to the chat
                bot.sendMessage(chatId, resp + ' total match count: ' + val);
            } else {
                bot.sendMessage(chatId, resp + ' total match count: ' + val);
            }
            sendSticker(chatId);
        }
    });
});

bot.onText(/\bbug\b/gm, (msg, match) => {
    bot.sendSticker(msg.chat.id, "CAADBQAD8wADDxXNGeYW5EDuT_6aAg");
});

bot.on('new_chat_participant', (msg, match) => {
    sendSticker(msg.chat.id);
})

function sendSticker(chatId) {
    const s = stickers[Math.floor(Math.random()*stickers.length)];
    bot.sendSticker(chatId, s);
}
