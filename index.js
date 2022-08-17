const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv").config();
const NAVER_ID = process.env.NAVER_ID;
const NAVER_SECRET = process.env.NAVER_SECRET;

// const corsOption = {
//   origin: "",
//   credentials: true,
// };

app.set("port", process.env.PORT || 8099);
const PORT = app.get("port");
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
app.use(express.json());

app.post("/detectlang", async (req, res) => {
  const name = req.body.cityName;
  const encodeQuery = encodeURIComponent(name);
  await axios({
    method: "POST",
    url: `https://openapi.naver.com/v1/papago/detectLangs?query=${encodeQuery}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET,
    },
  })
    .then((response) => {
      const langCode = response.data.langCode;
      axios({
        method: "POST",
        url: `https://openapi.naver.com/v1/papago/n2mt`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Naver-Client-Id": NAVER_ID,
          "X-Naver-Client-Secret": NAVER_SECRET,
        },
        params: {
          source: langCode,
          target: "ko",
          text: name,
        },
      }).then((respond) => {
        res.send(respond.data);
      });
    })
    .catch((err) => {
      // console.log(err);
      res.send(err);
    });
});
app.listen(PORT, () => {
  console.log(PORT, "포트");
});
