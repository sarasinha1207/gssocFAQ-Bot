const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
const faqs = require('./faqs.json');
require('dotenv').config();

const commands = [
  {
    name: 'faq',
    description: 'Get an answer to a GSSoC FAQ',
    options: [
      {
        name: 'question',
        description: 'Your question',
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Registering slash command...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash command registered.');
  } catch (err) {
    console.error(err);
  }
})();
