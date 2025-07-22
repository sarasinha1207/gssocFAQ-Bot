const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Events,
  AttachmentBuilder,
} = require("discord.js");
const stringSimilarity = require("string-similarity");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const documentationRoute = require("./routes/documentation");

require("dotenv").config();

const faqs = require("./faqs.json");
const projects = require("./projects.json");
const { sendPaginatedProjects } = require("./chunkMessgae");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const idKeywords = [
  "id",
  "id card",
  "identity",
  "card",
  "profile picture",
  "photo",
  "pic",
  "photo",
  "apply",
  "app",
  "insight app",
  "insights app",
  "developer",
  "developed",
];

const serverId = '1378813132788727970'; 
const TARGET_GUILD_ID = '1378813132788727970'; 

const promoMessage = `
📢 **Unofficial GSSOC FAQ Bot is Live!**  
> Get answers to common GSSOC questions, project details, and more — all through easy slash commands!  
> Built by contributors, for contributors 💖

---

🔹 **Try It Privately** *(since the bot isn't hosted publicly yet)*  
➕ [Add the Bot as an App](https://discord.com/oauth2/authorize?client_id=1396740851056640091&scope=applications.commands) *(slash command only)*

🔹 **Test Full Bot Invite (Admin)**  
🤖 [Add Full Bot to Your Server](https://discord.com/oauth2/authorize?client_id=1396740851056640091&permissions=8&integration_type=0&scope=bot+applications.commands)

---

### 💬 Slash Commands

**\`/faq\`**  
> 📚 *Ask any GSSoC-related question from our FAQ list*  
Example:  
\`/faq question: How do I register?\`

**\`/project\`**  
> 🔍 *Search for project info, like GitHub links, tech stack, and contribution guide*  
Example:  
\`/project project-name: GSSOC Bot question: how to contribute\`

---

💡 *Bot Name:* \`gssocFaq\` *(temporary, will change after approval)*

📦 **Contribute or ⭐ Star the GitHub Repo**  
🔧 [github.com/piyushpatelcodes/gssocFAQ-Bot](https://github.com/piyushpatelcodes/gssocFAQ-Bot)

---

📣 **Share with GSSoC friends!** Let’s make open source more accessible ✨
`;


client.once('ready', async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
 

});


client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log("userque: ", interaction.options.getString("question"));
    if (interaction.commandName === "faq") {
      const userQuestion = interaction.options.getString("question");
      const questions = faqs.map((faq) => faq.question);
      if (userQuestion.toLowerCase().includes("all commands")) {
        const allQuestions = faqs
          .map((f, i) => `• **${i + 1}.** ${f.question}`)
          .join("\n");

        await interaction.reply({
          content: `**📋 Here's a list of all available questions you can ask the bot:**\n\n${allQuestions}\n\n*Use \`/faq\` and start typing your question to get an instant answer!*`,
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
      console.log("bestMatch: ", bestMatch);

      if (match) {
        await interaction.reply(match.answer);
        const lowerQ = userQuestion.toLowerCase();
        if (idKeywords.some((keyword) => lowerQ.includes(keyword))) {
          const file = new AttachmentBuilder("./public/assets/idcard.png");
          await interaction.followUp({
            content:
              "You will get an ID card like this directly in your **Insight App** Only available for Android an iOS. You can download the app here: https://gssoc.girlscript.tech/#apply \n **Mail or ID CARD on Insights App**, Anything is a confirmation form GSSOC \n **Contribute in this GSSOC FAQ unofficial BOT** https://github.com/piyushpatelcodes/gssocFAQ-Bot",
            files: [file],
          });
        }
      } else {
        await interaction.reply("❌ Sorry, I couldn’t find an answer to that.");
      }
    } else if (interaction.commandName === "project") {
      const selectedProjectName = interaction.options.getString("project-name");
      const question = interaction.options.getString("question") || "";
      if (selectedProjectName === "All Projects") {
        const header = `📚 **GSSoC Projects (${projects.length} total):**\n\n`;
        const body = projects
          .map(
            (p, i) => `${i + 1}. [${p["Project name"]}](${p["Project link"]})`
          )
          .join("\n");
        const fullMessage = header + body;

        await sendPaginatedProjects(interaction, projects);

        return;
      }

      const project = projects.find(
        (p) =>
          p["Project name"].toLowerCase() === selectedProjectName.toLowerCase()
      );

      if (!project) {
        return interaction.reply("❌ Project not found.");
      }

      // Handle contribution question
      if (question.toLowerCase().includes("contribute")) {
        const contributionGuide = `📘 **Guide to Contribute to [${
          project["Project name"]
        }](${project["Project link"]})**:

1. **Fork** the repository: ${project["Project link"]}
2. **Clone** your fork locally:
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/${project["Project name"]
     .split(" ")
     .join("-")}
   \`\`\`
3. **Browse open issues** and find one you'd like to work on.
4. **Comment** on the issue asking to be assigned.
5. Create a new branch:
   \`\`\`bash
   git checkout -b fix-issue-123
   \`\`\`
6. Make your changes and **commit**:
   \`\`\`bash
   git commit -m "fix: add new feature"
   \`\`\`
7. Push and create a **Pull Request**.
8. Tag a mentor for review.

💡 Stay active and engage with mentors listed for guidance! \n 
See this For more detailed info: https://www.dataschool.io/how-to-contribute-on-github/
Contribute in this unofficial GSSOC FAQ BOT
https://github.com/piyushpatelcodes/gssocFAQ-Bot

   \n

Mentors:
- ${project["mentor 1"] || "N/A"} | [GitHub](${
          project["mentor 1 github"] || "#"
        }) | [LinkedIn](${project["mentor 1 linkedin"] || "#"})`;

        return interaction.reply(contributionGuide);
      }

      // Default: Show project info
      const embed = new EmbedBuilder()
        .setTitle(project["Project name"])
        .setURL(project["Project link"])
        .setDescription(project["Project description"])
        .addFields(
          {
            name: "🧠 Tech Stack",
            value: project["Tech stack"] || "Not specified",
          },
          {
            name: "👨‍💼 Admin",
            value: `${project["Project admin"]} - [GitHub](${project["Admin github"]}) | [LinkedIn](${project["Admin linkedin"]})`,
          }
        );

      // Add mentors
      const mentorFields = [];
      for (let i = 1; i <= 5; i++) {
        const mentor = project[`mentor ${i}`];
        if (mentor) {
          mentorFields.push({
            name: `🎓 Mentor ${i}`,
            value: `${mentor}\n[GitHub](${
              project[`mentor ${i} github`] || "#"
            }) | [LinkedIn](${project[`mentor ${i} linkedin`] || "#"})`,
          });
        }
      }
      embed.addFields(...mentorFields);
      embed.setColor("Random");

      await interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "faq") {
      try {
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
      } catch (error) {
        console.log("auto completete erroe: ", error);
      }
    }
    if (interaction.commandName === "project") {
      try {
        const focused = interaction.options.getFocused().toLowerCase();
        const choices = projects
          .filter((p) => p["Project name"].toLowerCase().includes(focused))
          .slice(0, 24)
          .map((p) => ({ name: p["Project name"], value: p["Project name"] }));

        choices.unshift({
          name: `📚 All Projects (Total: ${projects.length} Projects.)`,
          value: "All Projects",
        });
        await interaction.respond(choices);
      } catch (error) {
        console.log("auto completete erroe: ", error);
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);

// for documentation purpose

app.use("/docs", documentationRoute);

app.listen(3000, () => {
  console.log("🚀 Running at http://localhost:3000/docs");
});
