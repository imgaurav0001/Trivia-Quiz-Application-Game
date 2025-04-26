import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  unAttempted: number;
  wrong: number;
  correctAnswer: number;
}

const PieChart = ({ unAttempted, wrong, correctAnswer }: PieChartProps) => {
  const data = {
    labels: ["Correct", "Unattempted", "Wrong"], // Labels for the pie sections
    datasets: [
      {
        data: [correctAnswer, unAttempted, wrong], // Data values for each section
        backgroundColor: [
          "#36A2EB", // Blue for Correct
          "#FFCE56", // Yellow for Unattempted
          "#FF6384", // Red for Wrong
        ],
        borderColor: [
          "#36A2EB", // Blue border for Correct
          "#FFCE56", // Yellow border for Unattempted
          "#FF6384", // Red border for Wrong
        ],
        borderWidth: 1,
      },
    ],
  };

  // Corrected options without scales for pie charts
  // const options: ChartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top", // Valid position for the legend
  //       labels: {
  //         color: "#FFFFFF", // White label text color for contrast
  //       },
  //     },
  //   },
  // };

  return (
    <div style={styles.container}>
      <Pie data={data} />
    </div>
  );
};

// Styling for the background gradient and positioning
const styles = {
  container: {
    width: "350px",
    height: "350px",
    margin: "0 auto",
    color: "white",
    backdropFilter: "blur(10px)", // Soft blur to match your theme
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Slight transparency for background
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)", // Adds depth to the container
  },
};

export default PieChart;
