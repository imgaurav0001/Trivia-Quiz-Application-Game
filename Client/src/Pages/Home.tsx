import "@fontsource/montserrat";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import Category from "../Components/Category";
import { useAllState } from "../Hooks/useAllState";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { setData } = useAllState();

  const [allInput, setAllInput] = useState({
    name: "",
    category: "",
    question: 10,
  });
  function handleCategory(value: string) {
    setAllInput((prev) => {
      return { ...prev, category: value };
    });
  }

  function handleAllInput(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    setAllInput((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

    // console.log(e.target.name);
  }

  const navigate = useNavigate();
  function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setData(allInput);
    navigate("./instruction");

    // quiz();
  }
  return (
    <div
      className=" flex flex-col justify-center items-center w-screen h-screen font-montserrat py-7"
      style={{
        backgroundImage:
          "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
        position: "fixed",
        overflowY: "auto",
      }}
    >
      <div
        className="text-center -translate-y-16 p-5 md:-translate-y-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-500
        to-orange-500"
      >
        <h1 className=" text-8xl font-bold sm:font-extrabold tracking-wide leading-tight  ">
          TRIVIA QUIZ
        </h1>
        <p className=" md:text-lg text-gray-300 font-light mt-2">
          Test your knowledge with fun and engaging trivia!
        </p>
      </div>
      <form className="flex flex-col justify-between xl:w-4/12 lg:w-2/5 sm:w-1/2 sm:shrink  items-center h-2/6 sm:h-2/5">
        <input
          type="text"
          className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus-gray-400 p-2 m-4 w-full h-10"
          placeholder="Enter your name"
          required
          value={allInput.name}
          onChange={handleAllInput}
          name="name"
        />
        <div className="flex gap-4 justify-between w-full my-4">
          <label>
            <h3 className="ml-2 text-base font-medium text-gray-100 py-1">
              Category
            </h3>
            <Category handleCategory={handleCategory} />
          </label>

          <label>
            <h3 className="ml-2 text-base font-medium text-gray-100 py-1">
              No. of question
            </h3>
            <input
              onChange={handleAllInput}
              name="question"
              type="number"
              list="question"
              className="text-base font-normal text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40 md:w-48 lg:w-60 p-0.5 h-9"
              value={allInput.question}
            />
            <datalist id="question">
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </datalist>
          </label>
        </div>
        <button
          onClick={handleSubmit}
          className=" px-4 py-2  text-lg font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 my-8 w-1/2"
        >
          SUBMIT
        </button>
      </form>
      <button
        onClick={() => navigate("/multiplayer")}
        className=" px-4 py-2  text-lg font-semibold text-white bg-purple-500 rounded-lg hover:shadow-[0_0_10px_rgba(128,90,213,0.7)] hover:bg-purple-600 transition-all duration-300 my-8 w-1/2"
      >
        Multiplayer
      </button>
    </div>
  );
}
