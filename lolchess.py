from urllib.request import urlopen
from urllib.parse import urlparse, quote
from bs4 import BeautifulSoup
import re, asyncio, aiohttp, sys
from datetime import datetime, timedelta

S3_URL = "https://lolchess.gg/profile/kr/" 
S3_TFT_URL = "https://lolchess.gg/profile/kr/"
time_total = 0

# get match count
def get_match_count(account):
    url = S3_URL + quote(account) + "/s3/matches"
    html = urlopen(url)
    source = html.read()
    html.close()

    soup = BeautifulSoup(source, 'html.parser')

    total_game_count_tag = soup.find("h4")

    regex = re.compile(r'(\d+)')
    total_game_count = regex.search(total_game_count_tag.string).group()

    return int(total_game_count)

def get_page(count: int):
    return count // 10 if count // 10 == 0 else count // 10 + 1

async def get_html(page):
    async with aiohttp.ClientSession() as session:
        async with session.get(page) as response:
            global time_total
            
            source = await response.text()
            soup = BeautifulSoup(source, 'html.parser')
            match_time_list = soup.findAll("div", {"class": "length"})
            
            for match_time in match_time_list:
                time = datetime.strptime(match_time.text, "%M:%S")
                time_total = time_total + time.second + time.minute * 60

def main(argv):
    account = argv[1]
    total_game_count = get_match_count(account)
    page = get_page(total_game_count)
    urls = [S3_TFT_URL + quote(account) + "/s3/matches/all/" + str(page)
            for page in range(1, page + 1)]

    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        asyncio.gather(
            *(get_html(url) for url in urls)
        )
    )
    
    print(timedelta(seconds=time_total))

if __name__ == '__main__':
    main(sys.argv)