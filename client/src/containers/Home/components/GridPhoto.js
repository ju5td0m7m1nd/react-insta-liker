import React from "react";
import styled from "styled-components";

const PhotoWrapper = styled.div`
  width: 10em;
  opacity: ${props => (props.checked ? 1 : 0.7)};
  margin-left: 2em;
  margin-top: 2em;
  position: relative;
  border-radius: 10%;
  overflow: hidden;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

const Photo = styled.img`width: 100%;`;

const Checked = styled.img`
  position: absolute;
  width: 16px;
  bottom: 16px;
  right: 16px;
`;

class GridPhoto extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { src, checked } = this.props;
    return (
      <PhotoWrapper>
        <Photo src={src} />
        {checked ? <Checked src="/images/check.svg" /> : null}
      </PhotoWrapper>
    );
  }
}

export default GridPhoto;
