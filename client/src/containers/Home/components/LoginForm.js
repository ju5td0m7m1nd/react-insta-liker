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
        <Center>
          <LoginBtn onClick={() => login(this._getFormData())}>登入</LoginBtn>
        </Center>
      </Container>
    );
  }
}

export default LoginForm;
