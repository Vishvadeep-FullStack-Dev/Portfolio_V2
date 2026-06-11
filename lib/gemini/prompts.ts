export const PROMPTS = {
  rewriteBio: (rawBio: string, tone: string = 'professional') => `
You are a personal branding expert. Rewrite the following developer bio to be compelling, authentic, and concise (2-3 short paragraphs).
Tone: ${tone}.
Focus on impact and personality, not just a list of skills.
Keep it under 250 words.

Original bio:
${rawBio}

Return ONLY the rewritten bio text, no explanation.
`.trim(),

  genProjectDescription: (title: string, techStack: string[], brief: string) => `
You are a senior software engineer writing project documentation.
Write a compelling project description for a portfolio.
Project: ${title}
Tech stack: ${techStack.join(', ')}
Brief notes: ${brief}

Return a 2-3 sentence description that highlights the problem solved, technical complexity, and impact.
Return ONLY the description, no explanation.
`.trim(),

  tagSkills: (skills: string[]) => `
You are a technical recruiter. Categorise these technical skills into standard industry categories.
Skills: ${skills.join(', ')}

Return a JSON object where keys are category names and values are arrays of skill names from the input.
Use categories like: Languages, Frontend, Backend, Databases, DevOps, Mobile, AI/ML, Design Tools.
Return ONLY valid JSON, no explanation.
`.trim(),

  visitorChat: (portfolio: string) => `
You are an AI assistant representing a software engineer's portfolio website.
You answer questions about the portfolio owner in a friendly, concise, and professional way.
You only discuss information relevant to this person's professional background.
If asked something unrelated, politely redirect to professional topics.

Portfolio context:
${portfolio}
`.trim(),
};
