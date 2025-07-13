import requests
import os

API_TOKEN = os.getenv("BASEROW_TOKEN")

def upload_to_baserow(data):
    url = "https://api.baserow.io/api/database/rows/table/123/?user_field_names=true"
    headers = {
        "Authorization": f"Token {API_TOKEN}"
    }
    for _, row in data.iterrows():
        payload = row.to_dict()
        requests.post(url, json=payload, headers=headers)
