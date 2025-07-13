from langchain import SQLDatabaseChain
from langchain.llms import OpenAI
from sqlalchemy import create_engine

def run_query(prompt):
    db = create_engine("sqlite:///combined_output.db")
    chain = SQLDatabaseChain(llm=OpenAI(), database=db)
    return chain.run(prompt)
