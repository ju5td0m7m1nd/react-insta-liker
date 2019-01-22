import React from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";

const Container = styled.div`
  position: relative;
  width: 60%;
  height: 20em;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

const options = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    lineHeight: 2,
    yAxes: [
      {
        ticks: {
          stepSize: 1
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          padding: 20
        }
      }
    ]
  }
};
const DATA = (labels, data) => ({
  labels,
  datasets: [
    {
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data
    }
  ]
});

class TrendChart extends React.Component {
  constructor(props) {
    super(props);
  }

  generateChartData = () => {
    const { pastData } = this.props;
    const labels = pastData.map(d =>
      new Date(parseInt(d.id)).toLocaleDateString()
    );
    const data = pastData.map(d => d.data.count);
    return DATA(labels, data);
  };

  render() {
    const { pastData } = this.props;

    return (
      <Container>
        <Line data={this.generateChartData()} options={options} />
      </Container>
    );
  }
}

export default TrendChart;
