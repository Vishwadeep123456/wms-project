import streamlit as st
import pandas as pd
import plotly.express as px
from sku_mapper import map_skus_to_mskus
from upload_to_baserow import upload_to_baserow
# from ai_query import ask_ai
# from my_secrets import OPENAI_API_KEY  # Uncomment only if you have valid key

#  Page setup
st.set_page_config(page_title="SKU to MSKU Mapping Tool", layout="centered")
st.title("🧮 SKU to MSKU Mapping Tool")

# 📤 Upload section
uploaded_file = st.file_uploader("📤 Upload CSV or Excel file", type=["csv", "xlsx"])
df = None

if uploaded_file is not None:
    try:
        # 📂 Load file
        if uploaded_file.name.endswith(".csv"):
            df = pd.read_csv(uploaded_file)
        else:
            df = pd.read_excel(uploaded_file)

        st.success("✅ File uploaded successfully!")

        st.subheader("📄 Uploaded Data")
        st.dataframe(df.head())

        # 🔁 Mapping Logic
        df = map_skus_to_mskus(df)

        st.subheader("✅ Mapped Data")
        st.dataframe(df)

        # ⚠️ Invalid SKUs
        invalid_rows = df[df["MSKU"].isna()]
        if not invalid_rows.empty:
            st.warning(f"⚠️ {len(invalid_rows)} SKUs could not be mapped.")
            st.dataframe(invalid_rows)

        # ⬇️ Download
        csv = df.to_csv(index=False).encode("utf-8")
        st.download_button("📥 Download Mapped Data", csv, "mapped_data.csv", "text/csv")

        # 📤 Upload to Baserow
        if st.button("📤 Upload to Baserow"):
            upload_to_baserow(df)
            st.success("✅ Data uploaded to Baserow!")

        # 🔍 AI Section (disabled safely)
        st.subheader("🧠 Ask your data a question (AI-powered)")
        st.info("⚠️ AI feature is currently disabled due to OpenAI key error or quota limit.")
        # user_query = st.text_input("E.g. 'Total Qty by MSKU' or 'Show all SKUs with Qty > 10'")
        # if st.button("🧠 Run AI Query"):
        #     if user_query.strip() == "":
        #         st.warning("❗ Please enter a question.")
        #     else:
        #         with st.spinner("🤔 Thinking..."):
        #             ai_response = ask_ai(df, user_query, OPENAI_API_KEY)
        #             st.success("✅ AI Response:")
        #             st.write(ai_response)

        # 📊 Chart Section
        st.subheader("📊 Visualize Your Data")
        chart_type = st.selectbox("Choose Chart Type", ["Bar Chart", "Pie Chart", "Line Chart"])
        x_col = st.selectbox("X-axis", df.columns)
        y_col = st.selectbox("Y-axis", df.columns)

        if chart_type == "Bar Chart":
            fig = px.bar(df, x=x_col, y=y_col)
        elif chart_type == "Pie Chart":
            fig = px.pie(df, names=x_col, values=y_col)
        elif chart_type == "Line Chart":
            fig = px.line(df, x=x_col, y=y_col)

        st.plotly_chart(fig)

    except Exception as e:
        st.error(f" Error: {e}")
