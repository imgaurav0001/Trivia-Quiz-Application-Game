import React, { useEffect } from "react";

interface TimerProps {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  handleNextQuestion: () => void;
}

export default function Timer({ timeLeft, setTimeLeft, handleNextQuestion }: TimerProps) {
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup on unmount or reset
    } else {
      // Move to next question when time runs out
      handleNextQuestion();
    }
  }, [timeLeft, setTimeLeft, handleNextQuestion]);

  // Determine the style based on timeLeft
  const timerStyle = timeLeft < 5
    ? "text-red-500 font-bold"  // Red and bold for urgency
    : "text-green-500";         // Green for normal time

  return (
    <div className={`text-sm sm:text-xl ${timerStyle}`}>
      Time left: {timeLeft}
    </div>
  );
}
