const axios = require("axios");
const cheerio = require("cheerio");

const account = "{username}";

const ROOT_URL = "https://lolchess.gg/profile/kr";
const SEASONS = ['s2', 's3', 's3.5'];

async function getHtml(url) {
    try {
        return await axios.get(url);
    } catch (e) {
        console.error(e);
    }
}

function getMatchCounts(html) {
    const $ = cheerio.load(html.data);
    const regex =  /\d+/;
    const matchCount = Math.ceil(parseInt($("h4").text().match(regex)) / 10);
    const matchCountList = [...Array(matchCount + 1).keys()];
    matchCountList.shift();
    return matchCountList;
}

function getMatchTime(html) {
    const $ = cheerio.load(html.data);

    const [min, sec] = $("div .length").text().split(":");

    return parseInt(min) * 60 + parseInt(sec);
}

function getTimespanWithSeconds(seconds) {
    var days = Math.floor(seconds / (60 * 60 * 24));
    seconds = seconds % (60 * 60 * 24);
    var hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60); 
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60

    return { days, hours, minutes, seconds };
}

const getSeasonPlaytime = async (season) => {
    const url = encodeURI(`${ROOT_URL}/${account}/${season}/matches`);
    const html = await getHtml(url);
    const matchCounts = getMatchCounts(html);
    const matchUrls = matchCounts.map(count => `${url}/all/${count}`);
    const timeHtmls = await Promise.all(matchUrls.map(getHtml));
    const time = timeHtmls.map(getMatchTime).reduce((x, y) => x + y, 0);

    return {
        season, time, timespan: getTimespanWithSeconds(time),
    };
};

async function getPlaytime() {
    const seasons = await Promise.all(SEASONS.map(getSeasonPlaytime));
    const total = seasons.reduce((x, y) => x + y.time, 0);
    
    return {
        time: total,
        timespan: getTimespanWithSeconds(total),
        seasons,
    };
}

getPlaytime().then(res => console.log(JSON.stringify(res, null, 4)));