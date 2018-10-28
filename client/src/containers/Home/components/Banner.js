import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  font-size: 1em;
  padding: 20% 0px;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
`;

const Title = styled.h1`
  color: #06060a;
  font-weight: bold;
  margin: 0px;
`;

const Description = styled.h3`color: #d2d2d2;`;

class Banner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        <TextWrapper>
          <Title>INSTALIKER</Title>
          <Description>
            Search the hashtag, let the bot does the magic.
          </Description>
        </TextWrapper>
      </Container>
    );
  }
}

export default Banner;
