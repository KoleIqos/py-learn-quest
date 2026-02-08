import { Question } from "./gameTypes";

/**
 * Evaluates a text answer by checking if keywords from the correct answer
 * appear in the user's response (case-insensitive).
 */
export function evaluateTextAnswer(userAnswer: string, question: Question): boolean {
  const normalized = userAnswer.toLowerCase().trim();
  const keyword = question.correctAnswer.toLowerCase().trim();
  return normalized.includes(keyword);
}

/**
 * Evaluates a multiple choice answer.
 */
export function evaluateMultipleChoice(selected: string, question: Question): boolean {
  return selected === question.correctAnswer;
}

/**
 * Evaluates code by doing a normalized string comparison.
 * In a real scenario this would execute Python — for now we do smart string matching.
 */
export function evaluateCode(userCode: string, question: Question): {
  correct: boolean;
  feedback: string;
} {
  const cleanUser = normalizeCode(userCode);
  const cleanExpected = normalizeCode(question.correctAnswer);

  // Check for key structural elements
  const keyParts = extractKeyParts(question.correctAnswer);
  const matchCount = keyParts.filter((part) => cleanUser.includes(normalizeCode(part))).length;
  const matchRatio = keyParts.length > 0 ? matchCount / keyParts.length : 0;

  if (cleanUser === cleanExpected) {
    return { correct: true, feedback: "Perfect match! Your code is correct." };
  }

  if (matchRatio >= 0.8) {
    return { correct: true, feedback: "Great job! Your solution works correctly." };
  }

  if (matchRatio >= 0.5) {
    return {
      correct: false,
      feedback: "You're on the right track! Check the structure of your code carefully.",
    };
  }

  return {
    correct: false,
    feedback: `Not quite. ${question.hint}`,
  };
}

function normalizeCode(code: string): string {
  return code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .join("\n")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeyParts(code: string): string[] {
  return code
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}
