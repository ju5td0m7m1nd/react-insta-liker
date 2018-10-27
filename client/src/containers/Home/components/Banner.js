import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class Banner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        <h1>Insta liker</h1>
      </Container>
    );
  }
}

export default Banner;
