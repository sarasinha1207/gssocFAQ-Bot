const faqs = require('../faqs.json');

module.exports = {
  name: 'faq',
  description: 'Get an answer to a GSSoC FAQ',
  options: [
    {
      name: 'question',
      description: 'Your question',
      type: 3, // STRING
      required: true,
    },
  ],
  async execute(interaction) {
    const userInput = interaction.options.getString('question').toLowerCase();

    const match = faqs.find(faq =>
      faq.question.toLowerCase().includes(userInput)
    );

    if (match) {
      await interaction.reply({
        content: `**Q:** ${match.question}\n**A:** ${match.answer}`,
        ephemeral: false,
      });
    } else {
      await interaction.reply({
        content: "❌ Sorry, I couldn't find an answer to that question.",
        ephemeral: true,
      });
    }
  },
};

