const axios = require("axios");
const cheerio = require("cheerio");

const account = "디킨슨";

const URL_A = "https://lolchess.gg/profile/kr"
const URL_S3_5 = encodeURI(`${URL_A}/${account}/s3.5/matches`);
const URL_S3 = encodeURI(`${URL_A}/${account}/s3/matches`);
const URL_S2 = encodeURI(`${URL_A}/${account}/s2/matches`);

const MATCH_URL_S3_5 = URL_S3_5 + '/all/'
const MATCH_URL_S3 = URL_S3 + '/all/'
const MATCH_URL_S2 = URL_S2 + '/all/'

const url_list = [URL_S2, URL_S3, URL_S3_5];
const match_url_list = [MATCH_URL_S2, MATCH_URL_S3, MATCH_URL_S3_5];

async function getHtml(url) {
    try {
        return await axios.get(url);
    } catch (e) {
        console.error(e);
    }
}

function getMatchCount(html) {
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

function secToTimeDelta(seconds) {
    var days = Math.floor(seconds / (60 * 60 * 24));
    seconds = seconds % (60 * 60 * 24);
    var hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60); 
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60

    return [days, hours, minutes, seconds];
}

async function main() { 
    const url_list = [URL_S2, URL_S3, URL_S3_5];
    const [html_s2, html_s3, html_s3_5] = await Promise.all(url_list.map(url => getHtml(url)));

    const matchCount_s2_list = getMatchCount(html_s2);
    const matchCount_s3_list = getMatchCount(html_s3);
    const matchCount_s3_5_list = getMatchCount(html_s3_5);

    var s2_url_list = [];
    for(num in matchCount_s2_list) {
        s2_url_list.push(MATCH_URL_S2 + num);
    }

    var s3_url_list = [];
    for(num in matchCount_s3_list) {
        s3_url_list.push(MATCH_URL_S3 + num);
    }

    var s3_5_url_list = [];
    for(num in matchCount_s3_5_list) {
        s3_5_url_list.push(MATCH_URL_S3_5 + num);
    }

    const s2_time_html_list = await Promise.all(s2_url_list.map(url => getHtml(url)));
    const s3_time_html_list = await Promise.all(s3_url_list.map(url => getHtml(url)));
    const s3_5_time_html_list = await Promise.all(s3_5_url_list.map(url => getHtml(url)));

    var s2_time = 0;
    for(var time_html of s2_time_html_list) {
        s2_time += getMatchTime(time_html);
    }
    
    var s3_time = 0;
    for(var time_html of s3_time_html_list) {
        s3_time += getMatchTime(time_html);
    }

    var s3_5_time = 0;
    for(var time_html of s3_5_time_html_list) {
        s3_5_time += getMatchTime(time_html);
    }

    console.log([secToTimeDelta(s2_time) , secToTimeDelta(s3_time), secToTimeDelta(s3_5_time)]);
    console.log(secToTimeDelta(s2_time + s3_time + s3_5_time))
}

main();