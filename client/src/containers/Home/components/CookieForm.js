import React from "react";
import styled from "styled-components";

const SpaceBetween = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30em;
  @media all and (max-device-width: 768px) {
    height: auto;
    flex-direction: column;
  }
`;

const Form = styled.div`
  z-index: 2;
  height: 100%;
  width: 60%;
  background-color: #e3e3e3;
  position: relative;
  color: #707070;
  padding: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  @media all and (max-device-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  width: 60%;
  margin-top: 2em;
  padding: 8px 0px;
  outline: none;
  border: 0px;
  font-size: 1em;
  border-bottom: 1px solid #707070;
  background: transparent;
  text-align: center;
`;

const H2 = styled.h2`
  color: #303030;
  text-align: center;
`;

const Button = styled.button`
  padding: 1em;
  outline: none;
  background-color: #f7bf2e;
  color: #202020;
  margin-top: 2em;
  border: 0px;
  transition: all .3s ease-in;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  }
`;

const Image = styled.img`
  height: 100%;
  position: absolute;
  right: 0;
  @media all and (max-device-width: 768px) {
    position: relative;
    width: 100%;
  }
`;

const Tutorial = styled.a`
  background-color: #234;
  color: #f0f0f0;
  border-radius: 50%;
  text-decoration: none;
  width: 2em;
  height: 2em;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 8px;
  bottom: 8px;
`;

class CookieForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { onChange, _checkValid } = this.props;
    return (
      <SpaceBetween>
        <Form>
          <H2>機器人需要一些您的資料...</H2>
          <Input
            placeholder="cookie"
            onChange={e => onChange("cookie", e.target.value)}
          />
          <Input
            placeholder="x-csrftoken"
            onChange={e => onChange("xCsrfToken", e.target.value)}
          />
          <Input
            placeholder="x-instagram-ajax"
            onChange={e => onChange("xInstagramAjax", e.target.value)}
          />
          <Button onClick={_checkValid}>確認用戶</Button>
          <Tutorial
            target="_blank"
            href="https://medium.com/@ju5td0m7m1nd/instaliker-instagram-%E8%A1%8C%E9%8A%B7%E6%A9%9F%E5%99%A8%E4%BA%BA-bc5911b90e70"
          >
            ?
          </Tutorial>
        </Form>
        <Image src="/iphonex.jpeg" />
      </SpaceBetween>
    );
  }
}

export default CookieForm;
