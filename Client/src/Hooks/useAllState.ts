import { useEffect, useState } from "react";
interface data {
  name: string;
  category: string;
  question: number;
}
export function useAllState() {
  const value = { name: "", category: "", question: 10 };
  const [allInput, setAllInput] = useState(() => {
    const Input = JSON.parse(localStorage.getItem("Input") || "{}");
    return Object.keys(Input).length > 0 ? Input : value;
  });

  // console.log("helo");

  useEffect(() => {
    localStorage.setItem("Input", JSON.stringify(allInput));
    // console.log("is this working?");
  }, [allInput]);

  // const [option, setOption] = useState([]);

  function setData(obj: data) {
    setAllInput(obj);
  }

  function randomValue(n: number) {
    return Math.floor(Math.random() * n);
  }
  return {
    allInput,
    setData,
    randomValue,
  };
}
