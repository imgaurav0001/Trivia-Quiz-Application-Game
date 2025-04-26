import "@fontsource/montserrat";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Category from "../../Components/Category";
import Lobby from "./Lobby";
import Question, { questionType } from "../Question";

export default function Multiplayer() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [status, setStatus] = useState(0);
  const [hostInput, setHostInput] = useState({
    name: "",
    roomId: 0,
    category: "",
    question: 10,
  });
  const [host, setHost] = useState(false);
  const [playerInput, setPlayerInput] = useState({ name: "", roomId: 0 });
  const [pLobby, setPLobby] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [allQuestion, setAllQuestion] = useState<questionType[] | null>();
  const [room, setRoom] = useState({ room: 0, id: "" });
  const [socket, setSocket] = useState<Socket | null>(null); // Track the socket instance

  // Function to initialize socket when the form is submitted
  const initializeSocket = () => {
    const url = import.meta.env.VITE_SERVER_URL;
    const socketInstance = io(url);
    setSocket(socketInstance);

    socketInstance.on("connected_players", (data) => {
      // console.log(data);
      setAllPlayers(data);
      setIsLoading(false);
    });

    socketInstance.on("room_error", (data) => {
      setErrorMessage(data);
      setIsLoading(false);
    });

    socketInstance.on("all_start_quiz", (data) => {
      setAllQuestion(data.results);
      // console.log(allQuestion);
    });

    socketInstance.on("get_id", (data) => {
      // console.log(data);
      setRoom((prev) => {
        return { ...prev, id: data };
      });
    });

    socketInstance.on("remove", (data) => {
      // console.log(data);
      setErrorMessage(data.error);
    });

    return socketInstance;
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.off("connected_players");
        socket.off("room_error");
        socket.off("all_start_quiz");
      }
    };
  }, [socket]);

  function handleCategory(value: string) {
    setHostInput((prev) => {
      return { ...prev, category: value };
    });
  }

  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (status === 1) {
      setHostInput((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    } else if (status === 2) {
      setPlayerInput((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
  }

  function hostClick(e: React.FormEvent) {
    e.preventDefault();
    setHost(true);
    const socketInstance = initializeSocket();
    socketInstance.emit("host_details", { hostInput });
    setPLobby(true);

    setIsLoading(true);
    setRoom((prev) => {
      return { ...prev, room: hostInput.roomId };
    });
  }

  function playerClick(e: React.FormEvent) {
    e.preventDefault();
    const socketInstance = initializeSocket();
    socketInstance.emit("player_details", { playerInput });
    setPLobby(true);
    setIsLoading(true);
    setRoom((prev) => {
      return { ...prev, room: playerInput.roomId };
    });
  }

  function startQuiz() {
    if (socket) {
      socket.emit("start_quiz", hostInput);
    }
  }

  useEffect(() => {
    if (!isLoading && allPlayers.length > 0 && pLobby) {
      console.log("All players loaded:", allPlayers);
    }
  }, [allPlayers, isLoading, pLobby]);

  return (
    <>
      {allQuestion ? (
        <Question
          multiQuestion={allQuestion}
          socket={socket}
          name={allPlayers}
          roomNo={room}
        />
      ) : (
        <div
          className="flex flex-col justify-center items-center w-screen sm:h-screen m-fit font-montserrat py-7"
          style={{
            backgroundImage:
              "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
            overflowY: "auto",
          }}
        >
          <div
            className="text-center p-5 translate-y-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-500
     to-orange-500 min-h-28"
          >
            <h1 className="text-5xl md:text-8xl font-bold sm:font-extrabold tracking-wide leading-tight ">
              MULTIPLAYER
            </h1>
            <p className="text-sm md:text-lg text-gray-300 font-light mt-2">
              Invite friends and test knowledge with them!
            </p>
          </div>

          {/* Content Section */}
          <div className="flex flex-col items-center justify-center w-screen h-screen p-5">
            <div
              className="w-11/12 max-w-4xl min-h-[400px] p-5 
                bg-white-900 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0  rounded-lg shadow-md hover:shadow-2xl mt-10 text-gray-100 "
            >
              {!pLobby ? (
                <div className="text-center h-full w-full flex justify-center items-center flex-col min-h-fit">
                  <div className="flex flex-col gap-5 my-4">
                    <h2 className="text-xl md:text-3xl mb-6 text-gray-300 font-semibold">
                      Ready to Begin? Pick Your Path!
                    </h2>
                    <div className="flex justify-center items-center flex-row gap-4">
                      <button
                        onClick={() => setStatus(1)}
                        className="px-6 py-3 text-md md:text-xl font-medium md:font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 shadow-md"
                      >
                        Create Room
                      </button>
                      <button
                        onClick={() => setStatus(2)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg text-md md:text-xl font-medium md:font-semibold hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] transition-all duration-300 shadow-md"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                  <div>
                    <hr></hr>
                    {status === 1 && (
                      <form className="flex flex-col gap-5 mt-8  animate-slideDown">
                        <h3 className="text-2xl font-semibold">
                          Create a New Room
                        </h3>
                        <div className="flex flex-col md:flex-row gap-4">
                          <label>
                            <h3 className="ml-7 md:ml-2 text-left text-base font-medium text-gray-100 py-1">
                              Enter Name
                            </h3>
                            <input
                              type="text"
                              placeholder="Your Name"
                              name="name"
                              value={hostInput.name}
                              onChange={onChangeInput}
                              className="text-base font-normal text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-5/6 md:w-48 lg:w-64 p-0.5 h-9"
                            />
                          </label>
                          <label>
                            <h3 className="ml-7 md:ml-2 text-left text-base font-medium text-gray-100 py-1">
                              Room Number
                            </h3>
                            <input
                              type="number"
                              placeholder="Room Number"
                              name="roomId"
                              value={hostInput.roomId}
                              onChange={onChangeInput}
                              className="text-base font-normal text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-5/6 md:w-48 lg:w-64 p-0.5 h-9"
                            />
                          </label>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                          <label>
                            <h3 className="ml-7 md:ml-2 text-left text-base font-medium text-gray-100 py-1">
                              No. of question
                            </h3>

                            <input
                              onChange={onChangeInput}
                              type="number"
                              name="question"
                              list="question"
                              value={hostInput.question}
                              className="text-base font-normal text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-5/6 md:w-48 lg:w-64 p-0.5 h-9"
                            />
                            <datalist id="question">
                              <option value={10}>10</option>
                              <option value={15}>15</option>
                              <option value={20}>20</option>
                              <option value={30}>30</option>
                            </datalist>
                          </label>
                          <label>
                            <h3 className="ml-7 md:ml-2 text-left text-base font-medium text-gray-100 py-1">
                              Category
                            </h3>
                            <Category handleCategory={handleCategory} />
                          </label>
                        </div>
                        <button
                          onClick={hostClick}
                          className=" px-4 py-2 text-md md:text-lg font-md md:font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 my-8 w-3/4 md:w-1/2 self-center"
                        >
                          Start Room
                        </button>
                      </form>
                    )}
                    {status === 2 && (
                      <form className="flex flex-col gap-5 mt-8 animate-slideDown">
                        <h3 className="text-2xl font-semibold mb-4">
                          Join an Existing Room
                        </h3>
                        <div className="flex flex-col md:flex-row  gap-4">
                          <label>
                            <h3 className=" ml-7 md:ml-2 text-left text-base font-medium text-gray-100 py-1">
                              Enter Name
                            </h3>

                            <input
                              type="text"
                              placeholder="Your Name"
                              name="name"
                              value={playerInput.name}
                              onChange={onChangeInput}
                              className="text-base font-normal text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-5/6 md:w-48 lg:w-64 p-0.5 h-9"
                            />
                          </label>
                          <label>
                            <h3 className="ml-7 md:ml-2 text-left text-base font-medium text-gray-100 py-1">
                              Room Number
                            </h3>

                            <input
                              type="number"
                              placeholder="Room Number"
                              name="roomId"
                              value={playerInput.roomId}
                              onChange={onChangeInput}
                              className="text-base font-normal text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-5/6 md:w-48 lg:w-64 p-0.5 h-9"
                            />
                          </label>
                        </div>
                        <button
                          onClick={playerClick}
                          className=" px-4 py-2  text-lg font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 my-8 w-3/4 md:w-1/2 self-center"
                        >
                          Join Room
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 animate-pulse">
                  <span className="text-4xl">🌀</span>
                  <p className="mt-3 text-xl font-medium">Updating...</p>
                </div>
              ) : errorMessage ? (
                <div className="text-center mt-5 flex flex-col justify-center items-center w-full h-full -translate-y-20">
                  <div className="text-red-500 text-2xl font-semibold mb-5">
                    {errorMessage}
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-red-500 rounded-lg text-xl font-semibold hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Go back
                  </button>
                </div>
              ) : (
                <div className="text-center flex flex-col">
                  <Lobby allPlayer={allPlayers} socket={socket} host={host} />
                  <div className="flex gap-4 flex-col md:flex-row  self-center">
                    {status === 1 && (
                      <button
                        onClick={startQuiz}
                        className="px-6 py-3 bg-purple-500 rounded-lg text-md md:text-xl font-md md:font-semibold hover:bg-purple-600 transition-all duration-300 shadow-md hover:shadow-lg mt-4"
                      >
                        Start quiz
                      </button>
                    )}
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-red-500 rounded-lg text-md md:text-xl font-md md:font-semibold hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg mt-4"
                    >
                      Go back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
