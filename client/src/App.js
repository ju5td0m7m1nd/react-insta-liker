import React, { Component } from "react";
import ReactGA from "react-ga";
import logo from "./logo.svg";
import Home from "./containers/Home";
import Footer from "./containers/Home/components/Footer";

import "./App.css";

class App extends Component {
  state = {
    response: ""
  };

  componentDidMount() {
    ReactGA.initialize("UA-84532754-2");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    return (
      <div className="App">
        <Home />
        <Footer />
      </div>
    );
  }
}

export default App;
