# ai_query.py

from pandasai import SmartDataframe
from pandasai.llm.openai import OpenAI
import pandas as pd

def ask_ai(df, query, openai_api_key):
    try:
        llm = OpenAI(api_token=openai_api_key)
        sdf = SmartDataframe(df, config={"llm": llm})
        result = sdf.chat(query)
        return result
    except Exception as e:
        return f" Error: {e}"
