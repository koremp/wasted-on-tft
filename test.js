const axios = require("axios");
const cheerio = require("cheerio");

// axios를 활용해 AJAX로 HTML 문서를 가져오는 함수 구현
async function getHTML() {
  try {
    return await axios.get("https://lolchess.gg/profile/kr/%EB%94%94%ED%82%A8%EC%8A%A8/s3/matches");
  } catch (error) {
    console.error(error);
  }
}

getHTML()
  .then(html => {
    console.log(html.data)
    const $ = cheerio.load(html.data);
    var sth = $("h4").text();
    console.log(sth);
  })