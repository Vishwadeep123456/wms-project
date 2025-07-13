import streamlit as st
import pandas as pd
from backend.sku_mapper import SKUMapping

st.title(" SKU → MSKU Mapper")

uploaded_file = st.file_uploader("Upload Sales Data CSV", type=["csv"])
mapping_file = st.file_uploader("Upload Mapping File (SKU → MSKU)", type=["csv"])

if uploaded_file and mapping_file:
    sales_df = pd.read_csv(uploaded_file)
    mapping_df = pd.read_csv(mapping_file)

    mapper = SKUMapping(mapping_df)
    mapped_df = mapper.map_skus(sales_df)

    st.success("Mapping complete!")
    st.write(mapped_df)
    st.download_button("Download Mapped CSV", mapped_df.to_csv(index=False), "mapped_output.csv")
