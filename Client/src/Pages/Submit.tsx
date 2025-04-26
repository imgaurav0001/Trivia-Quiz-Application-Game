import "@fontsource/montserrat";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import PieChart from "../Components/PieChart";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Submit() {
  const location = useLocation();

  // Access the state passed from Page1
  const stateData = location.state;
  const navigate = useNavigate();
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null | number>(null);
  function restart() {
    if (timerId) {
      clearTimeout(timerId);
    }
    const timer = setTimeout(() => {
      navigate("/");
    }, 1000);
    setTimerId(timer);
  }

  function pRestart() {
    if (timerId) {
      clearTimeout(timerId);
    }
    navigate("/instruction");
  }

  useEffect(() => {
    setTimerId(null);
  }, []);

  return (
    <div
      className="h-screen font-montserrat flex flex-col items-center justify-center px-3 sm:px-10 py-6 text-gray-100"
      style={{
        backgroundImage:
          "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
        // position: "fixed",
        overflowX: "auto",
        minHeight: "fit-content",
      }}
    >
      {/* Main Heading */}
      {stateData && (
        <>
          <div className="my-12">
            <h1 className="text-center text-6xl md:text-8xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-orange-500 leading-tight py-10">
              COMPLETED
            </h1>
          </div>

          {/* Score and Analytics Section */}
          <div className="flex flex-col md:flex-row md:justify-between w-full sm:w-4/6 items-center sm:text-3xl font-bold gap-6 sm:gap-12 text-center">
            {/* Statistics Section */}
            <div className="flex flex-col gap-8 sm:gap-10 text-lg sm:text-xl text-gray-300">
              <div>
                <h3>SCORE</h3>
                <h3 className="text-4xl sm:text-6xl font-bold text-green-400">
                  {stateData.score}
                </h3>
              </div>
              <div>
                <h3>TOTAL QUESTIONS</h3>
                <h3 className="text-4xl sm:text-6xl font-bold text-yellow-500">
                  {stateData.total + 1}
                </h3>
              </div>
              <div>
                <h3>ATTEMPTED</h3>
                <h3 className="text-4xl sm:text-6xl font-bold text-orange-400">
                  {stateData.total - stateData.unAttempted}
                </h3>
              </div>
              <div>
                <h3>NOT ATTEMPTED</h3>
                <h3 className="text-4xl sm:text-6xl font-bold text-red-500">
                  {stateData.unAttempted + 1}
                </h3>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="mt-10 sm:mt-0 sm:w-1/3 flex justify-center">
              <PieChart
                correctAnswer={stateData.correctAnswer}
                unAttempted={stateData.unAttempted + 1}
                wrong={
                  stateData.total +
                  1 -
                  stateData.correctAnswer -
                  (stateData.unAttempted + 1)
                }
              />
            </div>
          </div>

          {/* Restart Button */}

          <button
            onClick={restart}
            onDoubleClick={pRestart}
            className=" px-4 py-2 text-base sm:text-lg font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 my-12 w-1/2 sm:w-1/3"
          >
            Restart
          </button>
        </>
      )}
      {!stateData && (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-red-500">
            Not Attempted the Quiz
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            It seems you haven't attempted the quiz. Please try again!
          </p>
          <button
            onClick={() => navigate("/instruction")}
            className="px-4 py-2 text-base sm:text-lg font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 my-12 w-1/2 sm:w-1/3"
          >
            Go back to Quiz
          </button>
        </div>
      )}
    </div>
  );
}
