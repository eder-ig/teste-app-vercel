import Chart from "chart.js";
import Chartkick from "vue-chartkick";

Chart.defaults.global.defaultFontColor = "#fafafa";

Chart.defaults.global.scales = {
  xAxes: [
    {
      scaleLabel: {
        fontColor: "#999",
      },
      gridLines: {
        color: "#666",
      },
      ticks: {
        fontColor: "#fff",
      },
    },
  ],
  yAxes: [
    {
      scaleLabel: {
        fontColor: "#999",
      },
      gridLines: {
        color: "#666",
      },
      ticks: {
        fontColor: "#fff",
      },
    },
  ],
};

export default Chartkick.use(Chart);
