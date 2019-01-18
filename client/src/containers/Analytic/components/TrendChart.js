import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

class TrendChart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Container />;
  }
}

export default TrendChart;
