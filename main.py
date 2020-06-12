import requests, sys, time
import asyncio, aiohttp

SUMMONER_URL = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
TFT_URL = "https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/"
MATCH_URL = "https://asia.api.riotgames.com/tft/match/v1/matches/"
API_KEY = "RGAPI-71436791-47b7-487e-b30e-2465243da791"


def main(argv):
    # get id
    data = requests.get(SUMMONER_URL + argv + "?api_key=" + API_KEY).json()
    PUUID = data['puuid']
    print(PUUID)

    # get tft matches
    match_ids = requests.get(TFT_URL + PUUID + "/ids?api_key=" + API_KEY + "&count=200").json()

    time_total = 0

    for match_id in match_ids:
        match_data = requests.get(MATCH_URL + match_id + "?api_key=" + API_KEY).json()

        try :
            for companion in match_data['info']['participants']:
                if companion['puuid'] == PUUID:
                    time_eliminated = int(companion['time_eliminated'])
                    time_total = time_total + time_eliminated
        except KeyError:
            
        else:
            print(time.strftime("%H:%M:%S", time.gmtime(time_total)))


if __name__ == '__main__':
    #main(sys.argv[1])
    main("디킨슨")