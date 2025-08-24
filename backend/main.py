from fastapi import FastAPI
from fastapi_mcp import FastApiMCP

app = FastAPI()

from pydantic import BaseModel, Field, PositiveFloat
from typing import Dict

class BMIInput(BaseModel):
    weight_kg: PositiveFloat = Field(..., description="Weight of the person in kilograms")
    height_m: PositiveFloat = Field(..., description="Height of the person in meters")

@app.get("/bmi", operation_id="calculate_bmi", summary="this tool is used to calculate bmi based on weigth and height")
def calculate_bmi(input: BMIInput) -> Dict[str,float]:
    """
    compute bmi using weight and height
    sample request 
    {
        "weight_m" : 64.0,
        "height_m" : 1.5 
    }
    """
    bmi_value = input.weight_kg / (input.height_m ** 2)
    return {"bmi": bmi_value}

mcp = FastApiMCP(app, name="BMI MCP", description="Simple application to calculate BMI")
mcp.mount_http()


# crew_mcp_agent.py
import sys
from crewai import Agent, Task, Crew, Process, LLM
from crewai_tools import MCPServerAdapter
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()


import os
os.environ["OPENAI_API_KEY"] = "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"

server_params = {"url": "http://127.0.0.1:8000/mcp", "transport": "streamable-http"}
llm = LLM(model="openrouter/openai/gpt-oss-20b:free")

@app.get("/query")
def main(user_query: str):
    with MCPServerAdapter(server_params, connect_timeout=60) as mcp_tools:
        selected_tools = list(mcp_tools)

        agent = Agent(
            role="MCP Tooling Agent",
            goal="do not make unneccessary api calls to llm and answer the queries based on tools you have",
            backstory="Connected to FastAPI MCP server, able to invoke its tools.",
            tools=selected_tools,
            llm=llm,
            verbose=True,
        )

        task = Task(
            description=user_query,  # 👈 feed user input here
            expected_output="Answer the query using MCP tools if needed.",
            agent=agent,
            markdown=True,
        )

        crew = Crew(
            agents=[agent],
            tasks=[task],
            process=Process.sequential,
            verbose=True,
        )
        result = crew.kickoff()
        print("\n--- RESULT ---\n", result)
        return result

if __name__ == "__main__":
    # read user query from command line
    query = " ".join(sys.argv[1:]) or "List available MCP tools and return results."
    main(query)
