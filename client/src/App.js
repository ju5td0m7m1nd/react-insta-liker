import React, { Component } from "react";
import logo from "./logo.svg";
import Home from "./containers/Home";
import Liker from "./containers/Liker";
import Analytic from "./containers/Analytic";
import ReactGA from "react-ga";
import styled from "styled-components";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

const DashboardContainer = styled.section`
  width: 84%;
  height: 100%;
  padding: 2em 4em;
`;

const SideBar = styled.div`
  width: 16%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 1.2em;
  background-color: #dfe8f5;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    width: 6em;
    border-radius: 50%;
  }
  h3 {
    color: #707070;
    font-weight: normal;
    font-size: 0.8em;
    margin-top: 8px;
  }
`;

const LogoutBtn = styled.h3`
  font-size: 0.8em;
  color: #707070;
  font-weight: normal;
  cursor: pointer;
`;

class App extends Component {
  state = {
    response: "",
    cookie: "",
    xCsrfToken: "",
    xInstagramAjax: "",
    valid: false,
    username: "",
    profilePic: ""
  };

  componentDidMount() {
    ReactGA.initialize("UA-84532754-2");
    ReactGA.pageview(window.location.pathname + window.location.search);
    this._login(window.localStorage);
  }
  _login = data => {
    const { cookie, xCsrfToken, xInstagramAjax } = data;
    if (!cookie || !xCsrfToken || !xInstagramAjax) {
      return;
    }
    this.setState({
      cookie,
      xCsrfToken,
      xInstagramAjax
    });
    fetch(
      `/api/check?cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}`
    )
      .then(r => r.json())
      .then(response => {
        ReactGA.event({
          category: "User",
          action: response.data.user.username
        });
        this._saveToLocal(data);

        this.setState({
          valid: true,
          username: response.data.user.username,
          userId: response.data.user.id,
          profilePic: response.data.user.profile_pic_url
        });
      })
      .catch(e => {
        throw new Error(e);
      });
  };

  _logout = () => {
    window.localStorage.removeItem("cookie");
    window.localStorage.removeItem("xCsrfToken");
    window.localStorage.removeItem("xInstagramAjax");
    window.location.reload();
  };

  _saveToLocal = data => {
    const { cookie, xCsrfToken, xInstagramAjax } = data;
    window.localStorage.setItem("cookie", cookie);
    window.localStorage.setItem("xCsrfToken", xCsrfToken);
    window.localStorage.setItem("xInstagramAjax", xInstagramAjax);
  };

  render() {
    const {
      cookie,
      xCsrfToken,
      xInstagramAjax,
      valid,
      profilePic,
      username,
      userId
    } = this.state;
    if (!valid) {
      return (
        <div className="App">
          <Home login={this._login} />
        </div>
      );
    }
    return (
      <div className="App">
        <SideBar>
          <ProfileWrapper>
            <img src={profilePic} />
            <h3>
              @{username}
            </h3>
          </ProfileWrapper>
          <LogoutBtn onClick={this._logout}>登出</LogoutBtn>
        </SideBar>
        <Router>
          <DashboardContainer>
            <Route
              path="/"
              exact
              render={() =>
                <Liker
                  cookie={cookie}
                  xCsrfToken={xCsrfToken}
                  xInstagramAjax={xInstagramAjax}
                />}
            />
            <Route
              path="/analytic/"
              render={() =>
                <Analytic
                  xCsrfToken={xCsrfToken}
                  xInstagramAjax={xInstagramAjax}
                  cookie={cookie}
                  userId={userId}
                />}
            />
          </DashboardContainer>
        </Router>
      </div>
    );
  }
}

export default App;
