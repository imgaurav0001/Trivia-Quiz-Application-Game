import "@fontsource/montserrat";
import { useAllState } from "../Hooks/useAllState";
import { fetchQuizQuestions } from "../Data/Api";
import { useEffect, useState } from "react";
import he from "he";
import Option from "../Components/Option";
import Timer from "../Components/Timer";
import { useNavigate } from "react-router-dom";
import Error from "../Components/Error";
import { Socket } from "socket.io-client";
import MultiSubmit from "./multiplayer/MultiSubmit";
export interface questionType {
  question: string;
  difficulty: string;
  category: string;
  option: string[];
  correctOption: string | number;
}

interface QuestionProps {
  multiQuestion?: questionType[];
  name?: {
    name: string;
    category?: string;
    question: number;
    id: string;
    role: string;
  }[]; // Add name prop
  socket?: Socket | null; // Add socket prop (you can replace `any` with a more specific type if needed)
  roomNo?: { room: number; id: string };
}

interface valType {
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  difficulty: string;
  category: string;
}
export default function Question({
  multiQuestion,
  name,
  socket,
  roomNo,
}: QuestionProps) {
  const { allInput, randomValue } = useAllState();

  // console.log(allInput);
  const [allQuestion, setAllQuestion] = useState<questionType[]>([]);

  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    string | number | undefined
  >();
  const navigate = useNavigate();
  const [unAttempted, setUnattempted] = useState(0);
  const [playersScore, setPlayerScore] = useState<
    { id: string; name: string; score: number; counter: number }[]
  >([]);

  useEffect(() => {
    if (socket && roomNo) {
      socket.emit("set_score", {
        id: roomNo.id,
        room: roomNo.room,
        score,
        counter,
      });
      socket.on("get_score", (data) => {
        // console.log(data);
        setPlayerScore((previousData) => {
          // console.log("previous data: " ,previousData)
          const playerDetails = data.map(
            (allData: {
              counter: number;
              id: string;
              score: number;
              room: number;
            }) => {
              const playerName =
                name?.find((p) => p.id === allData.id)?.name || "unknown";

              const playerExist = previousData.find((p) => p.id === allData.id);

              if (playerExist) {
                return {
                  ...playerExist,
                  score: allData.score,
                  counter: allData.counter + 1,
                };
              } else {
                return {
                  name: playerName,
                  id: allData.id,
                  score: allData.score,
                  counter: allData.counter + 1,
                };
              }
            }
          );

          return [...playerDetails];
        });
        // console.log(playersScore);
      });

      return () => {
        if (socket) {
          socket.off("get_score");
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomNo, socket, score, counter]); // Ensure these dependencies are updated correctly

  useEffect(() => {
    // console.log(allQuestion);
    const getQuestions = async () => {
      try {
        let data;
        if (multiQuestion) {
          // console.log(multiQuestion);
          data = multiQuestion;
        } else {
          data = await fetchQuizQuestions(allInput.question, allInput.category);
        }
        // console.log("Fetched data:", data);
        const formattedQuestions = data.map((val: valType) => ({
          question: val.question,
          difficulty: val.difficulty,
          category: val.category,
          option: [...val.incorrect_answers, val.correct_answer].sort(
            () => Math.random() - 0.5
          ),
          correctOption: val.correct_answer,
        }));

        setAllQuestion(formattedQuestions);
        setLoading(false);
        // console.log(allInput);
      } catch (err) {
        setError(true);
        console.error(err);
      }
    };

    getQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allInput]);

  const [correctAnswer, setcorrectAnswer] = useState(0);
  const stateData = {
    unAttempted: unAttempted,
    total: counter,
    score: score,
    correctAnswer: correctAnswer,
  };
  const [random, setRandom] = useState(0);
  const handleNextQuestion = () => {
    if (counter < allQuestion.length - 1) {
      if (selectedOption === allQuestion[counter].correctOption) {
        setScore((prevScore) => prevScore + timeLeft);
        setcorrectAnswer((prev) => prev + 1);
      }
      if (selectedOption === undefined || selectedOption === "") {
        setUnattempted((prev) => prev + 1);
      }
      setCounter((prevCounter) => prevCounter + 1);
      setTimeLeft(20);
      setSelectedOption("");
      setRandom(randomValue(bgColor.length));
      // console.log(selectedOption);
    } else {
      if (!multiQuestion && !socket) {
        navigate("./submit", { state: stateData });
      } else {
        if(counter <= allQuestion.length){
          setCounter((prevCounter) => prevCounter + 1);
        }
        
      }
      // console.log(unAttempted);
      // Optionally reset or redirect
    }
  };

  function selectOption(value: string | number) {
    setSelectedOption(value);
    // console.log(selectedOption);
  }

  if (loading) {
    return (
      <div
        className="flex flex-col justify-center items-center h-screen"
        style={{
          backgroundImage:
            "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
        }}
      >
        <div className="relative">
          <div className="w-24 h-24 border-4 border-t-6 border-l-6 border-r-6 border-solid rounded-full animate-spin border-blue-400 border-t-indigo-600 border-l-pink-500 border-r-yellow-500"></div>
        </div>
        <div className="text-gray-200 text-lg mt-5 font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return <Error />;
  }

  const bgColor = [
    "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to right top, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to right bottom, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to bottom, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to left, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to top, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to right, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
    "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
  ];

  // if (counter === allQuestion.length && socket && ) {
  //   return (
  //     <MultiSubmit
  //       socket={socket}
  //       playerScore={playersScore}
  //       stateData={stateData}
  //     />
  //   );
  // }

  return (
    <>
      {playersScore && socket && counter === allQuestion.length ? (
        <MultiSubmit
          socket={socket}
          playerScore={playersScore}
          stateData={stateData}
        />
      ) : (
        <div
          style={{
            backgroundImage: bgColor[random], // No need for curly braces around bgColor[0]
            position: "fixed",
            overflowY: "auto",
          }}
          className="w-screen h-screen  items-start py-6  px-3 sm:px-10 text-justify font-montserrat text-gray-100"
        >
          <div className="h-full flex  flex-col">
            <div className="flex justify-between  text-xs  sm:font-medium  sm:text-lg">
              <div className="sm:flex justify-between w-1/2 ">
                {playersScore.length ? (
                  <div className="flex flex-col ">
                    All Players:
                    {playersScore.map((val, idx) => (
                      <h3 key={idx}>
                        {val.name}: {val.score} Q: {val.counter}
                      </h3>
                    ))}
                  </div>
                ) : (
                  <h3>Score: {score}</h3>
                )}

                {/* <h3>Time Left: {timeLeft}s</h3> */}
                <Timer
                  handleNextQuestion={handleNextQuestion}
                  setTimeLeft={setTimeLeft}
                  timeLeft={timeLeft}
                />
              </div>
              <div>
                <h3 className=" sm:p-1 text text-right">
                  {he.decode(allQuestion[counter].category)}
                </h3>
                <h3 className="sm:p-1 text text-right">
                  Difficulty Level: {allQuestion[counter].difficulty}
                </h3>
              </div>
            </div>

            <div className="text-center translate-y-24 sm:translate-y-40">
              <div className="text-2xl sm:text-3xl sm:font-semibold">
                {he.decode(allQuestion[counter].question)}
              </div>

              <Option
                options={allQuestion[counter].option}
                disable={timeLeft <= 5}
                selectOption={selectOption}
                selectedOption={selectedOption}
              />
              <button
                onClick={handleNextQuestion}
                className=" px-4 py-2 text-base sm:text-lg font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 my-12 w-1/2 sm:w-1/3"
              >
                {allQuestion.length - 1 === counter
                  ? "SUBMIT"
                  : "Next Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
