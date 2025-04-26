export default function Error() {
  return (
    <div
      className="flex justify-center items-center h-screen p-6"
      style={{
        backgroundImage:
          "linear-gradient(to left top, #000020, #171950, #422686, #783069, #b13103)",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-opacity-70 bg-black text-white p-8 rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-red-500 rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 12H6"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v12"
            />
          </svg>
          <p className="text-2xl font-semibold text-red-500">
            Oops! Something went wrong.
          </p>
          <p className="text-lg text-gray-300">
            We couldn't fetch the question at this time. Please try again later.
          </p>
        </div>
      </div>
    </div>
  );
}
