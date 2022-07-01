const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const emojis = require("emojis-list");
const EMOJI_GROUP_ID = "120363039231072541@g.us";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message_create", async (msg) => {
  try {
    if (msg.id.remote === EMOJI_GROUP_ID) {
      if (isEmoji(msg.body)) {
        console.log("trying");
        const chat = await msg.getChat();
        const actionMessages = await chat.fetchMessages({ limit: 2 });
        const searchFor = actionMessages[0].body;
        const reactWith = actionMessages[1].body;

        const reactTo = (
          await client.searchMessages(searchFor, { limit: 20 })
        ).filter((v) => v.id.remote !== EMOJI_GROUP_ID)[0];
        reactTo.react(reactWith);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

function isEmoji(emoji) {
  if (emojis.includes(emoji)) return true;
  else return false;
}

client.initialize();
