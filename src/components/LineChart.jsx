import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

// Register all necessary chart.js components
ChartJS.register(...registerables);

// Custom plugin to draw a vertical line on tooltip hover
const verticalLinePlugin = {
  id: "verticalLineOnTooltip",
  beforeTooltipDraw: (context) => {
    const { scales, tooltip, ctx } = context;
    if (tooltip.getActiveElements().length > 0) {
      const tooltipElement = tooltip.getActiveElements()[0];
      const x = tooltipElement.element.x;
      const y = tooltipElement.element.y;

      // Save the context for later restoration
      ctx.save();

      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(x, scales.y.top);
      ctx.lineTo(x, scales.y.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(128,128,128)";
      ctx.stroke();

      // Draw circle at the hovered point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      // Restore the context
      ctx.restore();
    }
  },
};

// Register the custom plugin
ChartJS.register(verticalLinePlugin);

export default function LineChart({ data }) {
  // Map data for chart labels and values
  const hourlyLabels = data.map((entry) => entry.time);
  const dataValue = data.map((entry) => entry.value.toFixed(5));

  // Determine the line color based on value trend
  const dataValueColor =
    dataValue[0] > dataValue[dataValue.length - 1]
      ? "rgba(220,58,51,0.4)" // Red for decreasing values
      : "rgba(0,128,0,0.4)"; // Green for increasing values

  const chartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: "Cours",
        data: dataValue,
        borderColor: dataValueColor,
        tension: 0.1,
        pointRadius: 0,
        fill: {
          target: "origin",
          above: dataValueColor,
        },
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}
