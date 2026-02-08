import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { evaluateTextAnswer, evaluateMultipleChoice, evaluateCode } from "@/data/codeEvaluator";
import { ENCOURAGEMENTS, HINTS_ON_WRONG } from "@/data/gameTypes";
import { Check, X, ArrowRight, Lightbulb, Code2, BookOpen, ListChecks } from "lucide-react";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function QuestionCard() {
  const { currentQuestion, submitAnswer, nextQuestion } = useGame();
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);

  if (!currentQuestion) return null;

  const q = currentQuestion;

  const handleSubmit = () => {
    let correct = false;
    let fb = "";

    if (q.type === "text") {
      correct = evaluateTextAnswer(userAnswer, q);
      fb = correct ? pickRandom(ENCOURAGEMENTS) : `${pickRandom(HINTS_ON_WRONG)} ${q.hint}`;
    } else if (q.type === "multiple-choice") {
      correct = evaluateMultipleChoice(selectedChoice ?? "", q);
      fb = correct ? pickRandom(ENCOURAGEMENTS) : `The correct answer is: ${q.correctAnswer}`;
    } else if (q.type === "code") {
      const result = evaluateCode(userAnswer, q);
      correct = result.correct;
      fb = correct ? pickRandom(ENCOURAGEMENTS) : result.feedback;
    }

    setIsCorrect(correct);
    setFeedback(fb);
    setSubmitted(true);
    submitAnswer(q.type === "multiple-choice" ? (selectedChoice ?? "") : userAnswer, correct);
  };

  const handleNext = () => {
    setUserAnswer("");
    setSelectedChoice(null);
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback("");
    setShowHint(false);
    nextQuestion();
  };

  const canSubmit =
    (q.type === "text" && userAnswer.trim().length > 0) ||
    (q.type === "multiple-choice" && selectedChoice !== null) ||
    (q.type === "code" && userAnswer.trim().length > 0);

  const TypeIcon = q.type === "code" ? Code2 : q.type === "multiple-choice" ? ListChecks : BookOpen;

  return (
    <motion.div
      key={q.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-3xl px-4 py-8"
    >
      {/* Topic & Type badges */}
      <div className="mb-4 flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <TypeIcon className="h-3.5 w-3.5" />
          {q.type === "code" ? "Code Challenge" : q.type === "multiple-choice" ? "Multiple Choice" : "Text Answer"}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {q.topic}
        </span>
        <span className="ml-auto text-xs font-semibold text-accent">{q.points} pts</span>
      </div>

      {/* Question */}
      <h3 className="mb-6 text-xl font-semibold leading-relaxed text-foreground whitespace-pre-wrap">
        {q.question}
      </h3>

      {/* Answer area */}
      {!submitted && (
        <div className="space-y-4">
          {q.type === "text" && (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && handleSubmit()}
              placeholder="Type your answer..."
              className="w-full rounded-xl border border-border bg-card px-5 py-4 text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          )}

          {q.type === "multiple-choice" && (
            <div className="grid gap-3">
              {q.choices?.map((choice) => (
                <button
                  key={choice}
                  onClick={() => setSelectedChoice(choice)}
                  className={`rounded-xl border-2 px-5 py-4 text-left font-medium transition-all ${
                    selectedChoice === choice
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-card-foreground hover:border-primary/40"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {q.type === "code" && (
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center gap-2 bg-code-bg px-4 py-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-accent/60" />
                  <div className="h-3 w-3 rounded-full bg-success/60" />
                </div>
                <span className="ml-2 font-mono text-xs text-code-foreground/60">python</span>
              </div>
              <textarea
                value={userAnswer || q.codeTemplate || ""}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={8}
                spellCheck={false}
                className="w-full resize-none bg-code-bg px-4 py-3 font-mono text-sm text-code-foreground placeholder:text-code-foreground/30 focus:outline-none"
                placeholder="# Write your Python code here..."
              />
            </div>
          )}

          {/* Hint button */}
          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Show hint
            </button>
          )}
          {showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg bg-accent/20 px-4 py-3 text-sm text-accent-foreground"
            >
              💡 {q.hint}
            </motion.p>
          )}

          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground disabled:opacity-40 transition-opacity"
          >
            Submit Answer
          </motion.button>
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div
              className={`flex items-start gap-3 rounded-xl p-5 ${
                isCorrect
                  ? "bg-success/10 border border-success/30"
                  : "bg-destructive/10 border border-destructive/30"
              }`}
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isCorrect ? "bg-success" : "bg-destructive"
              }`}>
                {isCorrect ? (
                  <Check className="h-5 w-5 text-success-foreground" />
                ) : (
                  <X className="h-5 w-5 text-destructive-foreground" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${isCorrect ? "text-success" : "text-destructive"}`}>
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="mt-1 text-sm text-foreground/80">{feedback}</p>
              </div>
            </div>

            {q.type === "code" && !isCorrect && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-code-bg px-4 py-2 text-xs font-mono text-code-foreground/60">
                  Expected solution
                </div>
                <pre className="bg-code-bg px-4 py-3 font-mono text-sm text-code-foreground overflow-x-auto">
                  {q.correctAnswer}
                </pre>
              </div>
            )}

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
