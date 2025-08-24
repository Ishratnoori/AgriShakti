from fastapi import FastAPI
from fastapi_mcp import FastApiMCP

app = FastAPI()

from pydantic import BaseModel, Field, PositiveFloat
from typing import Dict

curr_farmer_id = 1
farmers = {
    1 : {
          "lat": 17.924612,
          "log" : 73.712006,
          "fertilizers" : ["DAV"],
          "start_date" : "12-01-2025",
          "end_date" : "12-02-2025",
          "buffer" : 100,
          "soil_characteristics" : {'NDVI_mean': 0.46127950124962236, 'SM_surface': None,           'SM_rootzone': None, 'pH_top30cm': 5.6000000000000005, 'SOC_gkg_top30cm': 36.666666666666664, 'SOC_pct_top30cm': 3.6666666666666665, 'WC33_vpct_top30cm': 41.666666666666664},
          "current_crop" : "wheat",
          "state" : "karnataka",                    
        }

}

fertilizers = {
    "DAV" : {
        "N" : 30,
        "P" : 10,
        "K" : 23
    } 
}


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

# mcp = FastApiMCP(app, name="BMI MCP", description="Simple application to calculate BMI")
# mcp.mount_http()




### soil function

class SoilInput(BaseModel):
    lat: float = Field(..., description="Latitude of the location")
    lon: float = Field(..., description="Longitude of the location")
    buffer_m: PositiveFloat = Field(..., description="Buffer radius in meters around the point")
    start: str = Field(..., description="Start date for NDVI and moisture data (YYYY-MM-DD)")
    end: str = Field(..., description="End date for NDVI and moisture data (YYYY-MM-DD)")

@app.get(
    "/soil_stats",
    operation_id="get_soil_stats",
    summary="Fetch NDVI and moisture statistics for given location and time range"
)
def get_soil_stats(input: SoilInput) -> Dict[str, str]:
    """
    Always return a hardcoded crop health status for testing
    """
    return {
        "crop_health": "GOOD",
        "message": "Crop health is GOOD for the given location and date range (hardcoded test response)."
    }

mcp = FastApiMCP(app, name="Agri Controller", description="MCP for BMI and Soil health tools")
mcp.mount_http()


######




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
        ## for  debugging
        print("\n--- AVAILABLE TOOLS ---")
        for tool in selected_tools:
            print(f"Tool: {tool.name} | Description: {tool.description}")
        print("-----------------------\n")
        ###
        agent = Agent(
            role="MCP Tooling Agent",
           ## goal="do not make unneccessary api calls to llm and answer the queries based on tools you have",
            goal="Use available MCP tools to answer queries",
            backstory=f"The current farmer stats are {farmers.get(curr_farmer_id)}",
            tools=selected_tools,
            llm=llm,
            verbose=True,
        )

        task = Task(
            description=user_query,  # 👈 feed user input here
            # expected_output="Answer the query using MCP tools if needed. do not give formatted md, give me plain string",
            expected_output="Plain string answer using MCP tools if needed",
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

        # Ensure plain string only
        return str(result.raw) if hasattr(result, "raw") else str(result)

if __name__ == "__main__":
    # read user query from command line
    query = " ".join(sys.argv[1:]) or "List available MCP tools and return results."
    main(query)
