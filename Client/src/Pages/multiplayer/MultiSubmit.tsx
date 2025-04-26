import "@fontsource/montserrat";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import { Socket } from "socket.io-client";
import PieChart from "../../Components/PieChart";
import { SetStateAction, useEffect, useState } from "react";
interface submitProps {
  socket: Socket;
  playerScore: {
    counter: number;
    id: string;
    name: string;
    score: number;
  }[];
  stateData: {
    unAttempted: number;
    total: number;
    score: number;
    correctAnswer: number;
  };
}
export default function MultiSubmit({
  socket,
  playerScore,
  stateData,
}: submitProps) {
  const [playerScoreData, setplayerScoreData] = useState(playerScore);
  // console.log(playerScore);
  const [stillInQuiz, setStillInQuiz] = useState<string[]>([]);
  useEffect(() => {
    socket.on("get_score", (data) => {
      setplayerScoreData((previousData) => {
        const playerDetails = data.map(
          (allData: {
            counter: number;
            id: string;
            score: number;
            room: number;
          }) => {
            // Find if player exists in previousData
            const playerExist = previousData.find((p) => p.id === allData.id);

            if (playerExist) {
              // If player exists, return updated player object
              return {
                ...playerExist,
                score: allData.score,
                counter: allData.counter + 1,
              };
            } else {
              // If player does not exist, create a new player entry
              return {
                name: "unknown", // Set player name or use real name if available
                id: allData.id,
                score: allData.score,
                counter: allData.counter + 1,
              };
            }
          }
        );

        // Combine the updated playerDetails with previousData that was not updated
        return [...playerDetails];
      });

      const playersStillInQuiz: SetStateAction<string[]> = [];
      playerScoreData.forEach((player) => {
        if (player.counter < stateData.total) {
          playersStillInQuiz.push(player.name);
        }
      });

      setStillInQuiz(playersStillInQuiz);
    });

    return () => {
      socket.off("get_score");
    };
  }, [playerScoreData, socket, stateData.total]);

  return (
    <div
      className="w-screen flex flex-col justify-center items-center font-montserrat"
      style={{
        backgroundImage:
          "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
        overflowY: "auto",
      }}
    >
      {/* Completed Title */}
      <div className="my-12">
        <h1 className="text-center text-6xl md:text-8xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-orange-500 leading-tight py-10">
          COMPLETED
        </h1>
      </div>

      {/* Rankings Section */}
      <div
        className="w-11/12 max-w-4xl min-h-[400px] p-5 relative border
                bg-white-900 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0 rounded-lg shadow-md hover:shadow-2xl mt-10 text-gray-100 flex flex-col"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 text-green-400">
          Player Rankings
        </h2>
        {playerScoreData.length > 0 ? (
          <ul className="text-lg flex justify-center flex-col w-full md:w-1/3 self-center">
            {playerScoreData
              .sort((a, b) => b.score - a.score)
              .map((player, idx) => (
                <li key={idx} className="my-2">
                  <div className="flex  justify-between w-full">
                    <span>
                      <span className="font-semibold text-2xl">
                        {idx + 1}.{" "}
                      </span>
                      <span className="font-md md:font-semibold text-yellow-400">
                        {player.name}
                      </span>
                    </span>
                    <span className="text-green-400 font-md md:font-semibold">
                      {player.score} points
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400">
            No players in the rankings yet.
          </div>
        )}
        <hr className="my-6 border-gray-600" />
        {stillInQuiz.length > 0 ? (
          <div className="absolute bottom-5">
            Players still in the quiz: {stillInQuiz.join(", ")}
          </div>
        ) : (
          <div className="absolute bottom-5">
            All players have completed the quiz.
          </div>
        )}
      </div>

      {/* Score and Analytics Section */}
      <hr className="my-6 border-gray-600" />
      <h2 className="text-center text-4xl md:text-6xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-orange-500 leading-tight py-10">
        Statistics of your Play
      </h2>
      <div className="flex flex-col md:flex-row md:justify-between w-full sm:w-4/6 items-center sm:text-3xl font-bold gap-6 sm:gap-12 text-center mt-12">
        {/* Statistics Section */}
        <div className="flex flex-col gap-8 sm:gap-10 text-lg sm:text-xl text-gray-300">
          <div>
            <h3 className="text-gray-400">SCORE</h3>
            <h3 className="text-4xl sm:text-6xl font-bold text-green-400">
              {stateData.score}
            </h3>
          </div>
          <div>
            <h3 className="text-gray-400">TOTAL QUESTIONS</h3>
            <h3 className="text-4xl sm:text-6xl font-bold text-yellow-500">
              {stateData.total}
            </h3>
          </div>
          <div>
            <h3 className="text-gray-400">ATTEMPTED</h3>
            <h3 className="text-4xl sm:text-6xl font-bold text-orange-400">
              {stateData.total - stateData.unAttempted}
            </h3>
          </div>
          <div>
            <h3 className="text-gray-400">NOT ATTEMPTED</h3>
            <h3 className="text-4xl sm:text-6xl font-bold text-red-500">
              {stateData.unAttempted}
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
      <div className="flex justify-center my-8">
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="px-6 py-3 text-xl font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 shadow-md "
        >
          Restart
        </button>
      </div>
    </div>
  );
}
