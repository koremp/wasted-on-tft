const axios = require("axios");
const cheerio = require("cheerio");

const account = "디킨슨";

const URL_A = "https://lolchess.gg/profile/kr"
const URL_S3_5 = encodeURI(`${URL_A}/${account}/s3.5/matches`);
const URL_S3 = encodeURI(`${URL_A}/${account}/s3/matches`);
const URL_S2 = encodeURI(`${URL_A}/${account}/s2/matches`);

const URL_S3_5_MATCH = URL_S3_5 + '/all/'
const URL_S3_MATCH = URL_S3 + '/all/'
const URL_S2_MATCH = URL_S2 + '/all/'

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
    const matchcount = Math.ceil(parseInt($("h4").text().match(regex)) / 10);
    const matchcountlist = [...Array(matchcount + 1).keys()];
    matchcountlist.shift()
    return matchcountlist;
}

function getMatchTime(html) {
    const $ = cheerio.load(html.data);

    const time = $("div length").text();
    console.log(time);
}

async function main() { 
    const url_list = [URL_S2, URL_S3, URL_S3_5];
    const [html_s2, html_s3, html_s3_5] = await Promise.all(url_list.map(url => getHtml(url)));

    const matchCount_s2_list = getMatchCount(html_s2);
    const matchCount_s3_list = getMatchCount(html_s3);
    const matchCount_s3_5_list = getMatchCount(html_s3_5);

    var s2_url_list = [];
    for(num in matchCount_s2_list) {
        s2_url_list.push(URL_S2_MATCH + num);
    }

    var s3_url_list = [];
    for(num in matchCount_s3_list) {
        s3_url_list.push(URL_S3_MATCH + num);
    }

    var s3_5_url_list = [];
    for(num in matchCount_s3_5_list) {
        s3_5_url_list.push(URL_S3_5_MATCH + num);
    }

    const s2_time_html_list = await Promise.all(s2_url_list.map(url => getHtml(url)));
    const s3_time_html_list = await Promise.all(s3_url_list.map(url => getHtml(url)));
    const s3_5_time_html_list = await Promise.all(s3_5_url_list.map(url => getHtml(url)));

    var s2_time = 0;
    for(time_html in s2_time_html_list) {
        s2_time += getMatchTime(time_html);
    }
    
    var s3_time = 0;
    for(time_html in s3_time_html_list) {
        s3_time += getMatchTime(time_html);
    }

    var s3_5_time = 0;
    for(time_html in s3_5_time_html_list) {
        s3_5_time += getMatchTime(time_html);
    }

    console.log([s2_time, s3_time, s3_5_time]);
}

main();