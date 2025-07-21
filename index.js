const {
  Client,
  GatewayIntentBits,
  Events,
  AttachmentBuilder,
} = require("discord.js");
const stringSimilarity = require("string-similarity");
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const documentationRoute = require('./routes/documentation');

require("dotenv").config();

const faqs = require("./faqs.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const idKeywords = ["id", "id card", "identity", "card", "profile picture", "photo","pic", "photo", "apply","app", "insight app","insights app","developer","developed"];


client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "faq") {
      
      const userQuestion = interaction.options.getString("question");
      const questions = faqs.map((faq) => faq.question);
      if (userQuestion.toLowerCase().includes("all commands")) {
  const allQuestions = faqs.map((f, i) => `• **${i + 1}.** ${f.question}`).join("\n");

  await interaction.reply({
    content: `**📋 Here's a list of all available questions you can ask the bot:**\n\n${allQuestions}\n\n*Use \`/faq\` and start typing your question to get an instant answer!*`
  });
  return;
}

      const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(
        userQuestion,
        questions
      );

      let match = faqs.find(
        (f) => f.question.toLowerCase() === userQuestion.toLowerCase()
      );

      if (
        (!match || match === undefined || match === null) &&
        bestMatch.rating >= 0.3
      ) {
        match = faqs[bestMatchIndex];
      }
      console.log("bestMatch: ", bestMatch)

      if (match) {
        await interaction.reply(match.answer);
        const lowerQ = userQuestion.toLowerCase();
        if (idKeywords.some(keyword => lowerQ.includes(keyword))) {
          const file = new AttachmentBuilder("./public/assets/idcard.png");
          await interaction.followUp({
            content:
              "You will get an ID card like this directly in your **Insight App** Only available for Android an iOS. You can download the app here: https://gssoc.girlscript.tech/#apply \n **Mail or ID CARD on Insights App**, Anything is a confirmation form GSSOC",
            files: [file],
          });
        }
      } else {
        await interaction.reply("❌ Sorry, I couldn’t find an answer to that.");
      }
    }
  }

  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "faq") {
      const focused = interaction.options.getFocused().toLowerCase();

      const choices = faqs
        .filter((f) => f.question.toLowerCase().includes(focused))
        .slice(0, 25)
        .map((f) => {
          const trimmedQuestion =
            f.question.length > 100
              ? f.question.slice(0, 97) + "..."
              : f.question;
          return {
            name: trimmedQuestion,
            value: trimmedQuestion, 
          };
        });
      await interaction.respond(choices);
    }
  }
});

client.login(process.env.BOT_TOKEN);


// for documentation purpose


app.use('/docs', documentationRoute);

app.listen(3000, () => {
  console.log('🚀 Running at http://localhost:3000/docs');
});