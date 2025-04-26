import "@fontsource/montserrat";
import { useNavigate } from "react-router-dom";
export default function Instruction() {
  const instruction: string[] = [
    "The quiz consists of multiple-choice questions.",
    "Each question has a time limit of 30 seconds.",
    "Select the best answer from the options provided.",
    "In the last 5 seconds of the timer, you won't be able to change your answer.",
    "You can skip questions but won't get any points for them.",
    "Your score will be displayed at the end of the quiz.",
  ];
  const navigate = useNavigate();
  function onButtonClick() {
    navigate("./question");
  }

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
        position: "fixed",
        overflowY: "auto",
      }}
      className="w-screen h-screen items-start py-6 px-10 text-justify font-montserrat"
    >
      <h2 className="text-gray-100 text-5xl sm:text-6xl font-bold mb-6 tracking-wide ">
        Quiz Instructions
      </h2>
      <ul className="text-gray-200 text-lg list-disc space-y-3 list-inside tracking-wide py-4 ">
        {instruction.map((prev, idx) => {
          return (
            <li className="sm:text-xl text-sm" key={idx}>
              {prev}
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center translate-y-24">
        <button
          onClick={onButtonClick}
          className="text-white bg-transparent border text-2xl border-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white sm:my-8 h-28  w-10/12 md:w-1/3"
        >
          Start Quiz 🚀
        </button>
      </div>
    </div>
  );
}
