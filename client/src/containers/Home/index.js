import React from "react";
import styled from "styled-components";
import ReactGA from "react-ga";
import LoginForm from "./components/LoginForm";

const URL = hashtag => `https://www.instagram.com/explore/tags/${hashtag}/`;
const LOCATION_URL = "https://www.instagram.com/explore/locations/213032423/";
const LAZY_LOADING = endCursor =>
  `https://www.instagram.com/graphql/query/?query_hash=f92f56d47dc7a55b606908374b43a314&variables=%7B%22tag_name%22%3A%22vscotaiwan%22%2C%22show_ranked%22%3Afalse%2C%22first%22%3A2%2C%22after%22%3A%22${endCursor.split(
    "=="
  )[0]}%3D%3D%22%7D`;

const SpaceBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0px 5%;
`;

const Banner = styled.div`
  width: 40%;

  img {
    width: 80%;
  }
`;

const Line = styled.div`
  width: 3px;
  height: 80%;
  background-color: #a0a0a0;
`;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      media: {},
      likedImage: [],
      liking: false,
      cookie: "",
      xCsrfToken: "",
      xInstagramAjax: "",
      done: false
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const { cookie, xCsrfToken, xInstagramAjax } = nextProps;
    if (nextProps.cookie && !this.state.cookie) {
      this.setState({ cookie, xCsrfToken, xInstagramAjax }, this._checkIfValid);
    }
  }
  _onChange = (type, value) => this.setState({ [type]: value });

  _checkIfValid = () => {
    const { cookie, xCsrfToken, xInstagramAjax } = this.state;
    fetch(
      `/api/check?cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}`
    )
      .then(r => r.json())
      .then(response => {
        ReactGA.event({
          category: "User",
          action: response.data.user.username
        });
        this.setState(
          { valid: true, username: response.data.user.username },
          () => window.scrollTo(0, window.pageYOffset + 300)
        );
      })
      .catch(e => {
        throw new Error(e);
      });
  };

  _likePhoto = id => {
    const { cookie, xCsrfToken, xInstagramAjax } = this.state;
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
    const { cookie, xCsrfToken, xInstagramAjax } = this.state;
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
  _search = () => {
    const { hashtag } = this.state;
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
          this.setState({ data, media }, this._checkAllPhoto);
        } catch (e) {
          throw new Error(e);
        }
      })
      .catch(e => {
        throw new Error(e);
      });
  };
  _startLiker = () => {
    this.setState({ liking: true });
    this.state.media.edges.map((n, key) => {
      setTimeout(() => {
        this._likePhoto(n.node.id);
        // console.log(n.node.shortcode, `  ${key}`);
      }, 2000 * (key + 1));
    });
  };

  render() {
    const {
      data,
      media,
      likedImage,
      valid,
      username,
      liking,
      done
    } = this.state;
    const { login } = this.props;
    const hasImages = Object.keys(media).indexOf("edges") > 0;

    return (
      <SpaceBetween>
        <Banner>
          <img src="/images/banner.svg" />
        </Banner>
        <Line />
        <LoginForm login={login} />
      </SpaceBetween>
    );
  }
}

export default Home;
