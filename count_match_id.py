import requests

SUMMONER_URL = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
TFT_URL = "https://asia.api.riotgames.com/tft/match/v1/matches/by-puuid/"
MATCH_URL = "https://asia.api.riotgames.com/tft/match/v1/matches/"
API_KEY = "RGAPI-a085486b-02db-4926-aedc-0246fac939df"

data = requests.get(SUMMONER_URL + "디킨슨" + "?api_key=" + API_KEY).json()
PUUID = data['puuid']

print(PUUID)

match_ids = requests.get(TFT_URL + PUUID + "/ids?api_key=" + API_KEY + "&count=250").json()

print(len(match_ids))