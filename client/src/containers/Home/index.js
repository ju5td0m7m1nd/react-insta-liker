import React from "react";
import styled from "styled-components";
import Banner from "./components/Banner";
import CookieForm from "./components/CookieForm";

const URL = hashtag => `https://www.instagram.com/explore/tags/${hashtag}/`;
const LOCATION_URL = "https://www.instagram.com/explore/locations/213032423/";
const LAZY_LOADING = endCursor =>
  `https://www.instagram.com/graphql/query/?query_hash=f92f56d47dc7a55b606908374b43a314&variables=%7B%22tag_name%22%3A%22vscotaiwan%22%2C%22show_ranked%22%3Afalse%2C%22first%22%3A2%2C%22after%22%3A%22${endCursor.split(
    "=="
  )[0]}%3D%3D%22%7D`;

const HEADERS = {
  cookie: `csrftoken=McOO9gccBv4XR7J7cYTOGd27E412Fd8O; ds_user_id=43837610; mid=Wz5hDQAEAAHMyCReHMw9li8xlEPx; mcd=3; fbm_124024574287414=base_domain=.instagram.com; csrftoken=McOO9gccBv4XR7J7cYTOGd27E412Fd8O; shbid=3317; shbts=1540281796.6660485; sessionid=IGSC65620fc06b7e93632148a9f68b9d568110170968759c37e875e8d62084b39249%3AiSiiApzN7bEvhD7hjmgZNwLcrzaB6uV9%3A%7B%22_auth_user_id%22%3A43837610%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_token%22%3A%2243837610%3AUYGmAN6JsVE9Ih6extk2HXxpbHKcNB4t%3A8a141fdec3ad23573ee2197a638628cc8164169f70510dc948562f80d158151c%22%2C%22_platform%22%3A4%2C%22_remote_ip%22%3A%22218.161.58.209%22%2C%22_mid%22%3A%22WL12_gAEAAEC0gLb1USxNr09uXmD%22%2C%22_user_agent_md5%22%3A%2297de1fddac67554e2eb90d9a46b3dcd4%22%2C%22_token_ver%22%3A2%2C%22last_refreshed%22%3A1540281796.6673510075%7D; rur=ATN; fbsr_124024574287414=F5-xXWVYzq9zu3E3i1aLyxYvXbc7mJ-DvYnwbz408Lw.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUNEUnI1VDlaU1ctZkhyb0N2MDRSNG93STY0SEx4WnRJcUhNT041NzE0ZXY1MV9hZlpyQVNpaTZXOWxzNVpkTXBPTDFBRC1wZGVjcHRocFZEakhOa210ZmxJOEppMnlVbUdRaWlUalExRjdUbFhReEZlSjN4QVVxU0w1X0hfcjN3SzQzNVBha3pySTg3dVhmc25kX1Vyb3VWSmJYRnR4TmRZVUR3Q0FXdHVwcFhUcjNSMFkwZjJ0V0lPNHQzSUNMOTVjakh4VVVtZFo1dU9PZHF0ZXdHRHJjZWdYVXJYQ0hCeURnQlhaVncweVhTd1pMbFl3X2t0Q1ViQ3g0SEQ3QnF2ZlZyckdMMl9RTGc1NVJYZHNaX2gtRVdzOVdsSnJXZkpib0ZreURzbWpZOGxVd1Nyb2dhTHVnOGk3QllDV19LdXZkY2NSVnVxNk5MaFZDeUplZXJXNCIsImlzc3VlZF9hdCI6MTU0MDI4MTc5OSwidXNlcl9pZCI6IjEwMDAwMjQ0NDc4MzU2OCJ9; urlgen="{}:1gEri6:AsKDD7ZAaGSV_GvUh4gihdF56Ws"`,
  "x-csrftoken": "McOO9gccBv4XR7J7cYTOGd27E412Fd8O",
  "x-instagram-ajax": "d4e4c9fdb67b"
};

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
  margin-top: 10em;
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

const GridPhoto = styled.img`
  width: 10em;
  opacity: ${props => (props.checked ? 1 : 0.7)};
  margin-left: 2em;
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
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2em 0px;
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
      xInstagramAjax: ""
    };
  }
  componentDidMount() {}

  _onChange = (type, value) => this.setState({ [type]: value });

  _checkIfValid = () => {
    const { cookie, xCsrfToken, xInstagramAjax } = this.state;
    fetch(
      `/api/check?cookie=${cookie}&xCsrfToken=${xCsrfToken}&xInstagramAjax=${xInstagramAjax}`
    )
      .then(r => r.json())
      .then(response => {
        this.setState({ valid: true, username: response.data.user.username });
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
            this.setState({ likedImage: this.state.likedImage.concat(id) });
          }
        })
        .catch(e => {
          throw new Error(e);
        });
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
    const { data, media, likedImage, valid, username, liking } = this.state;
    const hasImages = Object.keys(media).indexOf("edges") > 0;

    return (
      <div>
        <SpaceBetween>
          <div>
            <Banner />
          </div>
        </SpaceBetween>
        <CookieForm
          onChange={this._onChange}
          _checkValid={this._checkIfValid}
        />
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
      </div>
    );
  }
}

export default Home;
