const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const PAGE_SIZE = 27; // projects per page

function createProjectEmbed(pageProjects, pageIndex, totalPages) {
  const embed = new EmbedBuilder()
    .setTitle(`📚 GSSoC Projects (Page ${pageIndex + 1}/${totalPages})`)
    .setColor('#00AAFF')
    .setDescription(
    //   pageProjects.map((p, i) => `${i + 1}. [${p["Project name"]}](${p["Project link"]})`).join('\n')
      pageProjects.map((p, i) => `${i + 1 + pageIndex * PAGE_SIZE}. [${p["Project name"]}](${p["Project link"]})`).join('\n')

    );
  return embed;
}

async function sendPaginatedProjects(interaction, projects) {
  const pages = [];
  for (let i = 0; i < projects.length; i += PAGE_SIZE) {
    pages.push(projects.slice(i, i + PAGE_SIZE));
  }

  let currentPage = 0;
  const totalPages = pages.length;

  const embedMessage = await interaction.reply({
    embeds: [createProjectEmbed(pages[currentPage], currentPage, totalPages)],
    components: [
      new ActionRowBuilder({
        components: [
          new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('◀️ Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next ▶️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(totalPages === 1),
        ],
      }),
    ],
    ephemeral: false,
    fetchReply: true,
  });

  const collector = embedMessage.createMessageComponentCollector({
    time: 120000,
  });

  collector.on('collect', async (btnInt) => {
    if (btnInt.user.id !== interaction.user.id) {
      return btnInt.reply({ content: 'This is not your interaction!', ephemeral: true });
    }

    if (btnInt.customId === 'next') currentPage++;
    if (btnInt.customId === 'prev') currentPage--;

    currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));

    await btnInt.update({
      embeds: [createProjectEmbed(pages[currentPage], currentPage, totalPages)],
      components: [
        new ActionRowBuilder({
          components: [
            new ButtonBuilder()
              .setCustomId('prev')
              .setLabel('◀️ Previous')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentPage === 0),
            new ButtonBuilder()
              .setCustomId('next')
              .setLabel('Next ▶️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentPage === totalPages - 1),
          ],
        }),
      ],
    });
  });

  collector.on('end', () => {
    embedMessage.edit({
      components: [
        new ActionRowBuilder({
          components: [
            new ButtonBuilder()
              .setCustomId('prev')
              .setLabel('◀️ Previous')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('next')
              .setLabel('Next ▶️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
          ],
        }),
      ],
    });
  });
}

module.exports = { sendPaginatedProjects };
