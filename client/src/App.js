import React, { Component } from "react";
import ReactGA from "react-ga";
import logo from "./logo.svg";
import Home from "./containers/Home";
import Liker from "./containers/Liker";
import styled from "styled-components";
import Footer from "./containers/Home/components/Footer";

import "./App.css";

const DashboardContainer = styled.section`
  width: 84%;
  height: 100%;
  padding: 2em 4em;
`;

const SideBar = styled.div`
  width: 16%;
  height: 100%;
  background-color: #dfe8f5;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

class App extends Component {
  state = {
    response: "",
    cookie: "",
    xCsrfToken: "",
    xInstagramAjax: ""
  };

  componentDidMount() {
    ReactGA.initialize("UA-84532754-2");
    ReactGA.pageview(window.location.pathname + window.location.search);
    this._retrieveStorage();
  }

  _retrieveStorage = () => {
    const { cookie, xCsrfToken, xInstagramAjax } = window.localStorage;
    this.setState({ cookie, xCsrfToken, xInstagramAjax });
  };

  render() {
    const { cookie, xCsrfToken, xInstagramAjax } = this.state;
    return (
      <div className="App">
        {/* <Home
          cookie={cookie}
          xCsrfToken={xCsrfToken}
          xInstagramAjax={xInstagramAjax}
        />
        <Footer /> */}
        <SideBar />
        <DashboardContainer>
          <Liker
            cookie={cookie}
            xCsrfToken={xCsrfToken}
            xInstagramAjax={xInstagramAjax}
          />
        </DashboardContainer>
      </div>
    );
  }
}

export default App;
