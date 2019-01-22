import React from "react";
import styled from "styled-components";
import TrendChart from "./components/TrendChart";
import Summary from "./components/Summary";
import Follower from "./components/Follower";
import { saveFollower, getFollower } from "../../utils/firebase";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1em 2em;
  overflow-y: scroll;
  background-color: #f7f7f7;
`;

const StartBtn = styled.div`
  margin-top: 0.8em;
  border-radius: 10px;
  align-items: center;
  display: flex;
  color: #222;
  padding: 0.8em 1.6em;
  font-size: 1em;
  cursor: pointer;
  width: fit-content;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  img {
    margin-right: 1em;
  }
`;

const Topic = styled.h1`
  font-size: 2.2em;
  color: #222;
`;

const Column = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5em;
`;

/*
  follower: [
    {
      timestamp: "",
      count: "",
    }
  ]
*/

class Analytic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edges: [],
      count: 0,
      done: false,
      analyzing: false,
      pastData: []
    };
  }
  async componentDidMount() {
    const pastData = await getFollower(this.props.userId.toString());
    this.setState({ pastData });
  }

  analyze = () => {
    this.setState({ analyzing: true }, this.getFollower);
  };

  save = async () => {
    const { userId } = this.props;
    const { count, edges } = this.state;
    const timestamp = new Date().getTime();
    saveFollower(userId, timestamp, count, edges);
    const pastData = await getFollower(this.props.userId.toString());
    this.setState({ done: true, analyzing: false, pastData });
  };

  getFollower = () => {
    const { cookie, xCsrfToken, xInstagramAjax, userId } = this.props;
    fetch(
      `/api/followers?cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}&userId=${userId}`
    )
      .then(r => r.json())
      .then(response =>
        this.setState(
          {
            count: response.data.user.edge_followed_by.count,
            edges: response.data.user.edge_followed_by.edges
          },
          () =>
            this.getMoreFollower(response.data.user.edge_followed_by.page_info)
        )
      );
  };

  getMoreFollower = pageInfo => {
    const { cookie, xCsrfToken, xInstagramAjax, userId } = this.props;

    if (pageInfo.has_next_page) {
      fetch(
        `/api/followers/more?cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}&userId=${userId}&cursor=${pageInfo.end_cursor}`
      )
        .then(r => r.json())
        .then(response => {
          this.setState({
            edges: this.state.edges.concat(
              response.data.user.edge_followed_by.edges
            )
          });

          setTimeout(
            () =>
              this.getMoreFollower(
                response.data.user.edge_followed_by.page_info
              ),
            2000
          );
        });
    } else {
      this.save();
    }
  };

  getFollowerFans = () => {
    const { cookie, xCsrfToken, xInstagramAjax, userId } = this.props;
    const { pastData } = this.state;
    const followersName = pastData[0].data.edges.map(e => e.node.username);
    fetch(
      `/api/followers/fans?cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}&userId=${userId}&edges=${JSON.stringify(
        followersName
      )}`
    )
      .then(r => r.json())
      .then(response => {});
  };

  getFollowerDifference = (newFollower, oldFollower) => {
    const newId = newFollower.data.edges.map(e => e.node.id);
    const oldId = oldFollower.data.edges.map(e => e.node.id);
    const newDiff = newId.filter(a => !oldId.includes(a));
    const oldDiff = oldId.filter(a => !newId.includes(a));
    return {
      newDiff,
      oldDiff
    };
  };

  render() {
    const { done, analyzing, pastData } = this.state;

    const offset =
      pastData.length > 1
        ? pastData.slice(-1)[0].data.count - pastData[0].data.count
        : null;
    const differences =
      offset !== null
        ? this.getFollowerDifference(pastData.slice(-1)[0], pastData[0])
        : null;
    return (
      <Container>
        <Topic>FOLLOWER ANALYTICS</Topic>
        <StartBtn onClick={analyzing ? () => {} : this.analyze}>
          <img src={analyzing ? "/images/pause.svg" : "/images/play.svg"} />
          {analyzing ? "Stop" : "Analyze"}
        </StartBtn>
        {pastData.length > 0
          ? <Column>
              <TrendChart pastData={pastData} />
              <Summary
                pastData={pastData}
                offset={offset}
                differences={differences}
              />
            </Column>
          : <Column>Loading</Column>}
        {
          <Column
            style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
          >
            <Follower
              differences={differences}
              pastData={pastData}
              type="new"
            />
            <Follower
              differences={differences}
              pastData={pastData}
              type="unfollow"
            />
          </Column>
        }
      </Container>
    );
  }
}

export default Analytic;
