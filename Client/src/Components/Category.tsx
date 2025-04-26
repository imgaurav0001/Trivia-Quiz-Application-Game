import React from "react";

interface allCategoryArray {
  value: number;
  Option: string;
}

interface categoryProp {
  handleCategory: (value: string) => void;
}
export default function Category({ handleCategory }: categoryProp) {
  const allCategory: allCategoryArray[] = [
    { value: 0, Option: "Any Category" },
    { value: 9, Option: "General knowledge" },
    { value: 10, Option: "Entertainment: Books" },
    { value: 11, Option: "Entertainment: Film" },
    { value: 12, Option: "Entertainment: Music" },
    { value: 13, Option: "Entertainment: Musical & Theatres" },
    { value: 14, Option: "Entertainment: Television" },
    { value: 15, Option: "Entertainment: Video Games" },
    { value: 16, Option: "Entertainment: Board Games" },
    { value: 17, Option: "Science & Nature" },
    { value: 18, Option: "Science: Computers" },
    { value: 19, Option: "Science: Mathematics" },
    { value: 20, Option: "Mythology" },
    { value: 21, Option: "Sports" },
    { value: 22, Option: "Geography" },
    { value: 23, Option: "History" },
    { value: 24, Option: "politics" },
    { value: 25, Option: "Art" },
    { value: 26, Option: "Celebrities" },
    { value: 27, Option: "Animals" },
    { value: 28, Option: "Vehicles" },
    { value: 29, Option: "Entertainment: Comics" },
    { value: 30, Option: "Science: Gadgets" },
    { value: 31, Option: "Entertainment: Japanese Anime & Manga" },
    { value: 32, Option: "Entertainment: Cartoon and Animation" },
  ];

  function handleValue(e: React.ChangeEvent<HTMLSelectElement>) {
    handleCategory(e.target.value);
    console.log(e.target.value);
  }

  return (
    <>
      <select
        onChange={handleValue}
        style={{ direction: "ltr" }}
        className="text-base font-normal mr-3 sm:mr-0 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40 md:w-48 lg:w-60 p-0.5 h-9 "
      >
        {allCategory.map((val, idx) => {
          return (
            <option key={idx} value={val.value}>
              {val.Option}
            </option>
          );
        })}
      </select>
    </>
  );
}
