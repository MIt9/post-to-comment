export const COMMENT_ANTI_SLOP_INSTRUCTIONS = `
CRITICAL DIRECTIVES FOR LINKEDIN/PROFESSIONAL COMMENTS (ANTI-AI SLOP):
1. STRICT LANGUAGE MATCHING:
   - Detect the language of the source post/article (e.g. Ukrainian, English, German, etc.).
   - Write ALL comment variants strictly in that EXACT SAME language.

2. NO SYCOPHANCY OR FLUFF:
   - NEVER start with empty praise: "Great post!", "Great writeup!", "Thanks for sharing!", "Couldn't agree more!", "Чудовий пост!", "Дякую, що поділилися!", "Цікава думка!".
   - Jump straight into your reaction, insight, personal experience, or counter-point.

3. NO AI BUZZWORDS & CLICHÉS:
   - Banned words (EN): delve, leverage, foster, tapestry, pivotal, crucial, testament, landscape, realm, game-changer.
   - Banned words (UA): занурюватися, поринати, є свідченням, поворотний момент, ландшафт, багатогранний, важелі, варто підкреслити.

4. NO THROAT-CLEARING & COLON REVEALS:
   - Avoid "Here's my take:", "The key point:", "Ось моя думка:", "Головний висновок:".

5. HUMAN PERSONALITY & VALUE:
   - Make comments feel like a real professional with an opinion, a nuanced agreement, a practical example from production, or a thoughtful question.
   - Vary sentence structures and keep comments concise (2-5 sentences).
`;

export function appendCommentAntiSlopInstructions(prompt: string): string {
  if (prompt.includes("ANTI-AI SLOP") || prompt.includes("STRICT LANGUAGE MATCHING")) {
    return prompt;
  }
  return `${prompt.trim()}\n\n${COMMENT_ANTI_SLOP_INSTRUCTIONS.trim()}`;
}

export function sanitizeComment(text: string): string {
  if (!text) return text;
  let clean = text.trim();

  // Strip leading/trailing double quotes first
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith('“') && clean.endsWith('”'))) {
    clean = clean.slice(1, -1).trim();
  }

  // 1. Strip sycophantic opening lines (English & Ukrainian)
  const sycophancyRegexes = [
    /^(great (post|writeup)|thanks for sharing|couldn't agree more|awesome writeup|insightful post|thought-provoking article)[,!.:]?\s*/i,
    /^(чудовий (пост|допис|матеріал)|дякую(, що поділилися)?|цікава думка|повністю згоден|гарна стаття)[,!.:]?\s*/i,
    /^(here's my take|the key takeaway|my two cents|ось моя думка|головний висновок)[,!.:]?\s*/i,
  ];

  for (const regex of sycophancyRegexes) {
    clean = clean.replace(regex, "");
  }

  // 2. Remove binary contrast: "It's not just X, it's Y" / "Це не просто X, це Y"
  clean = clean.replace(/(?:it's|it is) not (?:just|only) (.+?), (?:it's|it is) (.+?)\./gi, "$2.");
  clean = clean.replace(/це не просто (.+?), це (.+?)\./gi, "$2.");

  // 3. Replace em-dashes (—) with commas/periods
  clean = clean.replace(/\s*—\s*/g, ", ");

  return clean.trim();
}
