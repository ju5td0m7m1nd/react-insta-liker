import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 1em 2em;
  background-color: ${props => (props.follow ? "" : "")};
  margin-top: 1em;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  margin-right: 2em;
  height: 15em;
  overflow-y: scroll;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  margin-top: 0.8em;
`;

const ProfilePic = styled.img`
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
`;

const Title = styled.h2`
  color: #232323;
  font-weight: bold;
  font-size: 2em;
`;

const Username = styled.h4`
  font-size: 0.6em;
  font-weight: light;
  margin-left: 0.8em;
  color: #222;
`;

class Follower extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { differences, pastData, type } = this.props;
    if (differences === null) {
      return <div />;
    }
    return (
      <Container>
        <Title>
          {type === "new" ? "New Follower" : "Unfollowed"}
        </Title>
        {type === "new"
          ? differences.newDiff.map(matchId => {
              const matchData = pastData
                .slice(-1)[0]
                .data.edges.filter(d => d.node.id === matchId);
              return (
                <ProfileWrapper>
                  <ProfilePic
                    key={matchData[0].node.id}
                    src={matchData[0].node.profile_pic_url}
                    title={matchData[0].node.username}
                  />
                  <Username>
                    @{matchData[0].node.username}
                  </Username>
                </ProfileWrapper>
              );
            })
          : differences.oldDiff.map(matchId => {
              const matchData = pastData[0].data.edges.filter(
                d => d.node.id === matchId
              );
              return (
                <ProfileWrapper>
                  <ProfilePic
                    key={matchData[0].node.id}
                    src={matchData[0].node.profile_pic_url}
                    title={matchData[0].node.username}
                  />
                  <Username>
                    @{matchData[0].node.username}
                  </Username>
                </ProfileWrapper>
              );
            })}
      </Container>
    );
  }
}

export default Follower;
