import pandas as pd

def clean_sales_data(df):
    df.dropna(subset=["SKU"], inplace=True)
    df["Amount"] = df["Amount"].astype(float)
    return df
