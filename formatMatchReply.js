function formatMatchReply(matches) {
  let msg = "**⚡ Top FAQ Matches ⚡:**\n\n";
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const scorePercent = Math.round(m.score * 100);
    msg += `**⭐ Q${i + 1}:** ${m.question}\n\n**🟢 A:** ${m.answer}\nSimilarity Score: ${scorePercent}%\n`;

    if (m.score <= 0.45) {
      msg += "\n🔴 I found something similar, but it may not be relevant. Try rephrasing your question.\n";
    }

    msg += "\n";
  }
  return msg;
}

module.exports = formatMatchReply;
