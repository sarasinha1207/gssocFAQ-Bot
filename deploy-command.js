const { SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

// Define all your slash commands
const commands = [
  // /faq command
  new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Ask a GSSoC-related question')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Your question about GSSoC')
        .setRequired(true)
    ),

  // /project command
  new SlashCommandBuilder()
    .setName('project')
    .setDescription('Get information about a GSSoC project')
    .addStringOption(option =>
      option.setName('project-name')
        .setDescription('Enter the project name')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option.setName('phase')
        .setDescription('Select project phase')
        .addChoices(
          { name: 'Phase 1', value: 'phase1' },
          { name: 'Phase 2', value: 'phase2' }
        )
    )
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Any specific question about the project?')
    ),

  // ✅ /fun command
  new SlashCommandBuilder()
    .setName('fun')
    .setDescription('Get a fun GSSoC quote or fact')
].map(command => command.toJSON());

// Create REST client
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// Deploy commands
(async () => {
  try {
    console.log('🔄 Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),
      { body: commands }
    );

    console.log('✅ Slash commands registered successfully.');
  } catch (error) {
    console.error('❌ Failed to register slash commands:', error);
  }
})();
