import { test, expect } from "bun:test";
import { appendCommentAntiSlopInstructions, sanitizeComment } from "../src/antislop.ts";

test("appendCommentAntiSlopInstructions appends anti-slop guidelines", () => {
  const result = appendCommentAntiSlopInstructions("Write a comment.");
  expect(result).toContain("STRICT LANGUAGE MATCHING");
  expect(result).toContain("ANTI-AI SLOP");
});

test("sanitizeComment removes sycophantic greetings in English & Ukrainian", () => {
  expect(sanitizeComment("Great post! Really liked your point on performance.")).toBe("Really liked your point on performance.");
  expect(sanitizeComment("Чудовий допис! Повністю згоден з підходом.")).toBe("Повністю згоден з підходом.");
});

test("sanitizeComment cleans colon reveals and quote marks", () => {
  expect(sanitizeComment('"Here\'s my take: This architecture makes sense."')).toBe("This architecture makes sense.");
});
