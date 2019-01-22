import React, { Component } from "react";
import logo from "./logo.svg";
import Home from "./containers/Home";
import Liker from "./containers/Liker";
import Analytic from "./containers/Analytic";
import ReactGA from "react-ga";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./App.css";

const Loading = styled.div`
  width: 100%;
  height: 100vh;
  background: #1a7eee;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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

const LinkButton = styled.div`
  width: 100%;
  margin-top: 1em;
  a {
    color: #222;
    text-decoration: none;
    font-size: 0.8em;
  }
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
    this._checkLoginState(window.localStorage);
  }
  _checkLoginState = data => {
    const {
      cookie,
      xCsrfToken,
      xInstagramAjax,
      username,
      userId,
      profilePic
    } = data;
    if (
      cookie &&
      xCsrfToken &&
      xInstagramAjax &&
      username &&
      userId &&
      profilePic
    ) {
      this.setState({
        valid: true,
        cookie,
        xCsrfToken,
        xInstagramAjax,
        username,
        userId,
        profilePic
      });
    }
  };
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
        this._saveToLocal(data, response.data);

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
    window.localStorage.setItem("username");
    window.localStorage.setItem("userId");
    window.localStorage.setItem("profilePic");
    window.location.reload();
  };

  _saveToLocal = (data, profile) => {
    const { cookie, xCsrfToken, xInstagramAjax } = data;
    window.localStorage.setItem("cookie", cookie);
    window.localStorage.setItem("xCsrfToken", xCsrfToken);
    window.localStorage.setItem("xInstagramAjax", xInstagramAjax);
    window.localStorage.setItem("username", profile.user.username);
    window.localStorage.setItem("userId", profile.user.id);
    window.localStorage.setItem("profilePic", profile.user.profile_pic_url);
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
      if (xCsrfToken) {
        return <Loading>Loading...</Loading>;
      }
      return (
        <div className="App">
          <Home login={this._login} />
        </div>
      );
    }
    return (
      <Router>
        <div className="App">
          <SideBar>
            <ProfileWrapper>
              <img src={profilePic} />
              <h3>
                @{username}
              </h3>
              <LinkButton>
                <Link to="/">LIKER</Link>
              </LinkButton>
              <LinkButton>
                <Link to="/analytic">ANALYTIC</Link>
              </LinkButton>
            </ProfileWrapper>
            <LogoutBtn onClick={this._logout}>登出</LogoutBtn>
          </SideBar>

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
        </div>
      </Router>
    );
  }
}

export default App;
