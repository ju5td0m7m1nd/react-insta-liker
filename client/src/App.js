import React, { Component } from "react";

import logo from "./logo.svg";
import Home from "./containers/Home";

import "./App.css";

class App extends Component {
  state = {
    response: ""
  };

  render() {
    return (
      <div className="App">
        <Home />
      </div>
    );
  }
}

export default App;
