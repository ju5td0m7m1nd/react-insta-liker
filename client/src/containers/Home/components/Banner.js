import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  font-size: 1em;
  padding: 20% 0px 10%;
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
  &::after {
    width: 30%;
    height: 6px;
    content: "";
    background-color: #f7bf2e;
    display: block;
    margin-top: 4px;
  }
`;

const Description = styled.h3`
  color: #d2d2d2;
  margin-top: 8px;
  text-align: left;
`;

class Banner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        <TextWrapper>
          <Title>INSTALIKER</Title>
          <Description>輸入想要的 #hashtag, 再來就交給機器人</Description>
        </TextWrapper>
      </Container>
    );
  }
}

export default Banner;
