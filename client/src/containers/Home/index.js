import React from "react";
import styled from "styled-components";
import Banner from "./components/Banner";
import CookieForm from "./components/CookieForm";
import GridPhoto from "./components/GridPhoto";
import ReactGA from "react-ga";

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
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
`;

const Input = styled.input`
  width: 60%;
  border: 0px;
  border-bottom: 1px solid #202020;
  font-size: 2em;
  background-color: transparent;
  padding: 8px;
  outline: none;
`;

const SearchBtn = styled.button`
  background-color: #202020;
  color: #fff;
  padding: 9px;
  border: 0px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 2em;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin-top: 2em;
`;

const ContentWrapper = styled.div`
  background-color: transparent;
  width: 100%;
  height: 3em;
  margin: 2em 0px;
`;

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 2em;
`;

const Name = styled.h2`
  font-size: 2em;
  color: #202020;
  text-align: center;
  margin: 3em 0px;
`;

const StartBtn = styled.div`
  outline: none;
  border: 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 2em 0px;
  padding: 1em;
  background-color: #f7bf2e;
  color: #202020;
  transition: all .3s ease-in;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  background-color: #06060a;
  color: #f7bf2e;
  padding: 2em;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
`;

const NoRes = styled.h5`color: #a0a0a0;`;

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
    const hasImages = Object.keys(media).indexOf("edges") > 0;

    return (
      <div>
        <SpaceBetween>
          <div>
            <Banner />
          </div>
        </SpaceBetween>
        {!valid
          ? <CookieForm
              onChange={this._onChange}
              _checkValid={this._checkIfValid}
            />
          : null}

        {valid
          ? <InputWrapper>
              <Name>
                哈囉, {username}, 我已經準備就緒
              </Name>
              <Input
                placeholder="hashtag"
                onChange={e => this.setState({ hashtag: e.target.value })}
              />
              <SearchBtn onClick={this._search}>搜尋</SearchBtn>
            </InputWrapper>
          : null}

        {hasImages ? <ContentWrapper /> : null}
        {hasImages
          ? <StartBtn onClick={this._startLiker}>
              {liking ? <div className="lds-dual-ring" /> : null}
              {liking ? "努力按讚中" : "開始按讚"}
            </StartBtn>
          : null}
        {hasImages
          ? <NoRes>(免責聲明：此網站不負何過度使用後，可能被 Instagram 封鎖的責任，請適量、和取一定的間隔使用)</NoRes>
          : null}
        <Grid>
          {hasImages
            ? media.edges.map(node => {
                return (
                  <GridPhoto
                    src={node.node.display_url}
                    key={node.node.id}
                    checked={likedImage.indexOf(node.node.id) > -1}
                    onClick={() => this._likePhoto(node.node.id)}
                  />
                );
              })
            : null}
        </Grid>

        {done
          ? <Toast>
              自動按讚已完成！<br />
              因流量關係一般用戶只提供70張的額度<br />
              您可以重新查詢別的hashtag繼續使用<br />
              如個人或企業有需要更多張數的服務<br />
              請聯絡 franks0059@gmail.com<br />
              或私訊我的IG, @mhsun_tsai
            </Toast>
          : null}
      </div>
    );
  }
}

export default Home;
