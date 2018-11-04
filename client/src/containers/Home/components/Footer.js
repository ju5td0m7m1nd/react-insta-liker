import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 3rem 0px 3rem;
`;

const H4 = styled.a`font-size: 0.8rem;`;

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { isDesktop } = this.props;

    return (
      <FooterWrapper>
        <H4
          style={{ color: "#444", marginTop: "0.5rem" }}
          href="https://mhtsai.me/"
          target="_blank"
        >
          Copyright © 2018 Frank Tsai.
        </H4>
      </FooterWrapper>
    );
  }
}

export default Footer;
