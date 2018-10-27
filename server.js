const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 5000;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const HEADER = {
  cookie: `mcd=3; mid=W9Q4HgAEAAE8jbPDKCvK7tPRT5M7; csrftoken=tjDzUcrzKATRahrEFPxfLkRDo67SKgwN; shbid=9749; ds_user_id=8675187319; sessionid=8675187319%3AVaLCFA4eEvtnyI%3A17; rur=FRC; urlgen="{}:1gGLSu:H5g_7W6_8UIBF2xYSevpU9U4JLw"`,
  "x-csrftoken": "tjDzUcrzKATRahrEFPxfLkRDo67SKgwN",
  "x-instagram-ajax": "37b9c96f42db"
};
// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});
app.get("/api/like", (req, res) => {
  const { query } = req;
  const { id } = query;

  const options = {
    method: "POST",
    headers: HEADER,
    url: `https://www.instagram.com/web/likes/${id}/like/`
  };

  axios(options).then(r => res.send(r.data)).catch(e => console.log(e));
});
app.get("/api/checkIfLiked", (req, res) => {
  const { query } = req;
  const { id } = query;
  const PICTURE_URL = id => `https://www.instagram.com/p/${id}/?__a=1`;
  const options = {
    method: "POST",
    headers: HEADER,
    url: PICTURE_URL(id)
  };

  axios(options).then(r => res.send(r.data)).catch(e => console.log(e));
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
