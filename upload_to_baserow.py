# upload_to_baserow.py

import requests
from my_secrets import BASEROW_TOKEN, TABLE_ID


def upload_to_baserow(df):
    url = f"https://api.baserow.io/api/database/rows/table/{TABLE_ID}/?user_field_names=true"
    headers = {
        "Authorization": f"Token {BASEROW_TOKEN}",
        "Content-Type": "application/json"
    }

    success, failed = 0, 0

    for _, row in df.iterrows():
        data = {
            "SKU": row.get("SKU", ""),
            "Qty": row.get("Qty", 1),
            "MSKU": row.get("MSKU", ""),
            "OriginalSKU": row.get("OriginalSKU", ""),
        }

        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 200:
            success += 1
        else:
            failed += 1
            print(f" Failed: {response.status_code} → {response.text}")

    print(f" Uploaded {success} rows.  Failed {failed} rows.")
