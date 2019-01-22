import React from "react";
import styled from "styled-components";
import Input from "./Input";

const Container = styled.div`
  width: 50%;
  height: 100%;
  padding: 10% 10% 0px;
`;

const Instabot = styled.h1`
  font-size: 2.2em;
  color: #3c3636;
`;

const Description = styled.h4`
  color: #918282;
  margin-bottom: 2em;
`;

const LoginBtn = styled.div`
  padding: 1.2em 4.8em;

  font-size: 0.6em;
  background-color: #1a7eee;
  color: #fff;
  width: fit-content;
  border-radius: 24px;
  cursor: pointer;
`;

const Center = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 2em;
  justify-content: center;
`;

const HowTo = styled.div`
  margin-top: 0.8em;
  font-size: 8px;
  color: #404040;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 4px;
  border-bottom: 1px solid #404040;
`;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }

  _getFormData = () => ({
    cookie: this.cookie.state.text,
    xCsrfToken: this.xCsrfToken.state.text,
    xInstagramAjax: this.xInstagramAjax.state.text
  });

  render() {
    const { login } = this.props;
    return (
      <Container>
        <Instabot>INSTABOT</Instabot>
        <Description>行銷人只需要抓住趨勢，雜事讓機器人來做</Description>
        <Input ref={c => (this.cookie = c)} label="cookie" />
        <Input ref={c => (this.xCsrfToken = c)} label="x-csrf-token" />
        <Input ref={c => (this.xInstagramAjax = c)} label="x-instagram-ajax" />
        <Center style={{ flexDirection: "column" }}>
          <LoginBtn onClick={() => login(this._getFormData())}>登入</LoginBtn>
          <HowTo
            onClick={() =>
              window.open(
                "https://medium.com/@ju5td0m7m1nd/instaliker-instagram-%E8%A1%8C%E9%8A%B7%E6%A9%9F%E5%99%A8%E4%BA%BA-bc5911b90e70"
              )}
          >
            怎麼取得登入資訊?
          </HowTo>
        </Center>
      </Container>
    );
  }
}

export default LoginForm;
