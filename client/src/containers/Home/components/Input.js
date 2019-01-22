import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  position: relative;
  padding-top: 1.2em;
  margin-top: 1em;
  overflow: hidden;
`;

const Label = styled.label`
  position: absolute;
  top: ${props => (!props.focus ? "2.3em" : "-0.2em")};
  left: 0.8em;
  color: #e87f25;
  transition: all .3s ease-in-out;
  font-size: 0.8em;
`;

const InputBox = styled.input`
  outline: none;
  border: 0px;
  background-color: #efefef;
  padding: 0.8em;
  font-size: 1em;
  width: 100%;
  color: #303030;
  border-radius: 14px;
`;

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      text: ""
    };
  }
  render() {
    const { label } = this.props;
    const { focus, text } = this.state;
    return (
      <Container>
        <Label focus={focus}>
          {label || "cookie"}
        </Label>
        <InputBox
          value={text}
          onChange={e => this.setState({ text: e.target.value })}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false || text })}
        />
      </Container>
    );
  }
}

export default Input;
