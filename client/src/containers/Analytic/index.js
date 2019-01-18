import React from "react";
import styled from "styled-components";
import TrendChart from "./components/TrendChart";
import { saveFollower } from "../../utils/firebase";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10%;
  overflow-y: scroll;
  background-color: #f7f7f7;
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
      follower: {}
    };
  }
  componentDidMount() {
    this.analyze();
  }

  analyze = () => {
    this.getFollower();
  };

  save = () => {
    const timestamp = new Date().getTime();
    console.log(this.state);
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
        `/api/followers?cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}&userId=${userId}&cursor=${pageInfo.end_cursor}`
      )
        .then(r => r.json())
        .then(response => {
          this.setState({
            edges: this.state.edges.concat(
              response.data.user.edge_followed_by.edges
            )
          });
          // setTimeout(
          //   () =>
          //     this.getMoreFollower(
          //       response.data.user.edge_followed_by.page_info
          //     ),
          //   1000
          // );
        });
    } else {
      this.save();
    }
  };

  render() {
    return (
      <Container>
        <TrendChart />
      </Container>
    );
  }
}

export default Analytic;
