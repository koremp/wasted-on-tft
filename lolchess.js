const axios = require("axios");
const cheerio = require("cheerio");

const account = "디킨슨";

const URL_A = "https://lolchess.gg/profile/kr"
const URL_S3_5 = encodeURI(`${URL_A}/${account}/s3.5/matches`);
const URL_S3 = encodeURI(`${URL_A}/${account}/s3/matches`);
const URL_S2 = encodeURI(`${URL_A}/${account}/s2/matches`);

async function getMatchCountHtml(url) {
    try {
        return await axios.get(url);
    } catch (e) {
        console.error(e);
    }
}

function getMatchCount(html_list) {
    var match_count_list = [];

    for(html in html_list) {
        const $ = cheerio.load(html.data);
        const regex = /d+/;
        
        const $match_count = $("div.profile__match-history-v2 h4").children("");
        console.log($match_count);

        match_count_list.push($match_count);
    }
}

async function main() { 
    const matchCountHtmlList = await Promise.all([getMatchCountHtml(URL_S2), getMatchCountHtml(URL_S3), getMatchCountHtml(URL_S3_5)]);
    const matchCountList = getMatchCount(matchCountHtmlList);
    
}

main();