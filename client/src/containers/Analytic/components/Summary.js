import React from "react";
import styled from "styled-components";
import { FlexStart } from "../../../utils/designGuide";

const Container = styled.div`
  width: 30%;
  height: 20em;
  padding: 1em;
  background-color: #51c0bf;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

const Title = styled.h2`
  color: #fff;
  font-weight: bold;
  font-size: 4em;
`;

const Offset = styled.h3`
  color: ${props => (props.offset > 0 ? "#fff" : "#fff")};
  font-size: 0.8em;
  margin-right: 2em;
  margin-left: 2em;
`;

const ProfilePic = styled.img`
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
  margin-right: -0.8em;
`;

const Datetime = styled.div`color: #f3f3f3;`;

const Label = styled.label`color: #f0f0f0;`;

class Summary extends React.Component {
  constructor(props) {
    super(props);
  }

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
    const { pastData, offset, differences } = this.props;

    return (
      <Container>
        <Label>Follower count</Label>
        <FlexStart>
          <Title>
            {pastData.slice(-1)[0].data.count}
          </Title>
          <Offset offset={offset}>
            {`${offset > 0 ? "↑" : "↓"}${offset}`}
          </Offset>
        </FlexStart>
        {differences
          ? <FlexStart style={{ marginTop: "0.8em" }}>
              <Datetime>
                {`${new Date(
                  parseInt(pastData[0].id)
                ).toLocaleDateString()} - ${new Date(
                  parseInt(pastData.slice(-1)[0].id)
                ).toLocaleDateString()}`}
              </Datetime>
            </FlexStart>
          : null}
      </Container>
    );
  }
}

export default Summary;
