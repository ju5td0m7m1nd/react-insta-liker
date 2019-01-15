import React from "react";
import styled from "styled-components";
import SearchBox from "./components/SearchBox";
import GridPhoto from "./components/GridPhoto";
import ReactGA from "react-ga";

const URL = hashtag => `https://www.instagram.com/explore/tags/${hashtag}/`;
const LOCATION_URL = "https://www.instagram.com/explore/locations/213032423/";
const LAZY_LOADING = endCursor =>
  `https://www.instagram.com/graphql/query/?query_hash=f92f56d47dc7a55b606908374b43a314&variables=%7B%22tag_name%22%3A%22vscotaiwan%22%2C%22show_ranked%22%3Afalse%2C%22first%22%3A2%2C%22after%22%3A%22${endCursor.split(
    "=="
  )[0]}%3D%3D%22%7D`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
`;

const Topic = styled.h1`
  font-size: 2.2em;
  color: #222;
`;

const TopBar = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
`;

const Grid = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 2em;
  height: 80%;
  width: 100%;
  padding: 1em;
  overflow: scroll;
`;

const BtnWrapper = styled.div`display: flex;`;

const ClearBtn = styled.div`
  border-radius: 10px;
  background-color: #1a7eee;
  margin-left: 1em;
  color: #fff;
  padding: 0.8em 1.6em;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

const StartBtn = styled.div`
  border-radius: 10px;
  align-items: center;
  display: flex;
  color: #222;
  padding: 0.8em 1.6em;
  font-size: 1em;
  cursor: pointer;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  img {
    margin-right: 1em;
  }
`;

class Liker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media: {
        edges: [],
        liking: false,
        done: false,
        likedImage: [],
        error: ""
      }
    };
    this.likeRequests = [];
  }

  _search = hashtag => {
    this.setState({ liking: false, done: false, likedImage: [] });
    ReactGA.event({
      category: "Hashtag",
      action: hashtag
    });
    fetch(URL(hashtag))
      .then(async r => {
        const html = await r.text();
        return html;
      })
      .then(response => {
        try {
          const rawData = response
            .split("window._sharedData = ")[1]
            .split(`;</script>`)[0];
          const data = JSON.parse(rawData);
          const media =
            data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media;

          const nextPage =
            data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media
              .page_info.end_cursor;
          const nextUrl = LAZY_LOADING(nextPage);
          this.setState({ data, media, error: "" }, this._checkAllPhoto);
        } catch (e) {
          //throw new Error(e);
          this.setState({ error: "Invalid hashtag" });
        }
      })
      .catch(e => {
        //throw new Error(e);
      });
  };

  _likePhoto = id => {
    const { cookie, xCsrfToken, xInstagramAjax } = this.props;
    if (this.state.likedImage.indexOf(id) < 0) {
      fetch(
        `/api/like?id=${id}&cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}`
      )
        .then(r => r.json())
        .then(response => {
          if (response.status === "ok") {
            this.setState(
              { likedImage: this.state.likedImage.concat(id) },
              this._checkIfDone
            );
          }
        })
        .catch(e => {
          throw new Error(e);
        });
    }
  };

  _checkIfDone = () => {
    if (this.state.likedImage.length === this.state.media.edges.length) {
      this.setState({ done: true, liking: false });
    }
  };

  _checkIfLiked = id => {
    const { cookie, xCsrfToken, xInstagramAjax } = this.props;
    fetch(
      `/api/checkIfLiked?id=${id}&cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}`
    )
      .then(r => r.json())
      .then(response => {
        if (response.graphql.shortcode_media.viewer_has_liked) {
          this.setState({
            likedImage: this.state.likedImage.concat(
              response.graphql.shortcode_media.id
            )
          });
        }
      })
      .catch(e => {
        throw new Error(e);
      });
  };
  _checkAllPhoto = () => {
    const { media } = this.state;
    media.edges.map((e, key) => {
      setTimeout(() => {
        this._checkIfLiked(e.node.shortcode);
      }, 200 * (key + 1));
    });
  };

  _startLiker = () => {
    this.setState({ liking: true });
    this.state.media.edges.map((n, key) => {
      this.likeRequests.push(
        setTimeout(() => {
          this._likePhoto(n.node.id);
          // console.log(n.node.shortcode, `  ${key}`);
        }, 2000 * (key + 1))
      );
    });
  };

  _clearLiker = () => {
    this.setState({ liking: false }, () =>
      this.likeRequests.map(request => clearTimeout(request))
    );
  };

  _clearSearch = () => {
    this.setState({
      liking: false,
      done: false,
      likedImage: [],
      media: {
        edges: []
      }
    });
    this.searchBox.clear();
  };

  render() {
    const { isFocus, media, likedImage, error, liking } = this.state;
    const { cookie, xCsrfToken, xInstagramAjax } = this.props;
    return (
      <Container>
        <Topic>LIKER</Topic>
        <TopBar>
          <SearchBox search={this._search} ref={c => (this.searchBox = c)} />
          {media.edges.length > 0
            ? <BtnWrapper>
                <StartBtn
                  onClick={liking ? this._clearLiker : this._startLiker}
                >
                  <img
                    src={liking ? "/images/pause.svg" : "/images/play.svg"}
                  />
                  {liking ? "暫停" : "開始按讚"}
                </StartBtn>
                <ClearBtn onClick={this._clearSearch}>清除搜尋</ClearBtn>
              </BtnWrapper>
            : null}
        </TopBar>
        <Grid>
          {media.edges.map(node => {
            return (
              <GridPhoto
                src={node.node.display_url}
                key={node.node.id}
                checked={likedImage.indexOf(node.node.id) > -1}
                onClick={() => this._likePhoto(node.node.id)}
              />
            );
          })}
          {error ? error : null}
        </Grid>
      </Container>
    );
  }
}

export default Liker;
