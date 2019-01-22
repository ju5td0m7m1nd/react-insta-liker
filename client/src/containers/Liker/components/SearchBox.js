import React from "react";
import styled from "styled-components";
const SearchWrapper = styled.div`
  background-color: #efefef;
  padding: 0.8em;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  overflow-x: hidden;
  min-width: 20%;
  input {
    width: 100%;
    margin-left: 1em;
    outline: none;
    border: 0px;
    color: #222;
    font-size: 1em;
    background: transparent;
  }
`;

const SearchIcon = styled.img`
  width: 0.8em;
  margin-left: ${props => (props.isFocus ? "-1.6em" : "0em")};
  transition: all .3s ease-in;
`;

const SearchBtn = styled.img`
  position: absolute;
  right: ${props => (props.isFocus ? "0.8em" : "-100px")};
  width: 0.8em;
  transition: all .3s ease-in;
  cursor: pointer;
`;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      isFocus: false
    };
  }
  showSearchBtn = () => this.setState({ isFocus: true });
  hideSearchBtn = () =>
    this.setState({ isFocus: this.state.text.length > 0 || false });
  clear = () => this.setState({ text: "" });
  render() {
    const { isFocus, text } = this.state;
    const { search } = this.props;
    return (
      <SearchWrapper>
        <SearchIcon isFocus={isFocus} src="/images/magnifier.svg" />
        <input
          placeholder="hashtag"
          onFocus={this.showSearchBtn}
          onBlur={this.hideSearchBtn}
          value={text}
          onChange={e => this.setState({ text: e.target.value })}
        />
        <SearchBtn
          src="/images/magnifier.svg"
          isFocus={isFocus}
          onClick={() => search(text)}
        />
      </SearchWrapper>
    );
  }
}

export default SearchBox;
