from fastapi import FastAPI
from fastapi_mcp import FastApiMCP

app = FastAPI()

from pydantic import BaseModel, Field, PositiveFloat
from typing import Dict

import joblib
import numpy as np


encoder = joblib.load("models/encoder_yield.joblib")
yield_model = joblib.load("models/crop_yield_model.joblib")


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
    
######



class CropYieldInput(BaseModel):
    Jstate: str = Field(..., description="State name")
    Jdistrict: str = Field(..., description="District name")
    Jseason: str = Field(..., description="Season (e.g., Kharif, Rabi)")
    Jcrops: str = Field(..., description="Crop name")
    Jarea: PositiveFloat = Field(..., description="Area of cultivation in hectares")

# --------- Endpoint for Crop Yield Prediction ----------
@app.get(
    "/crop_yield",
    operation_id="predict_crop_yield",
    summary="Predict crop yield production for a given state, district, season, crop, and area"
)
def predict_crop_yield(input: CropYieldInput) -> Dict[str, str]:
    """
    Predicts crop yield based on input parameters using encoder and ML model.
    """

    # Encode categorical values (state, district, season, crop)
    encoded_features = encoder.transform([[input.Jstate, input.Jdistrict, input.Jseason, input.Jcrops]])
    
    # Combine encoded categorical with numerical (area)
    final_features = np.hstack([encoded_features, [[input.Jarea]]])

    # Predict production
    prediction = yield_model.predict(final_features)[0]

    return {
        "Predicted Production": f"{prediction:.2f}",
        "message": f"Predicted production for {input.Jcrops} in {input.Jdistrict}, {input.Jstate} ({input.Jseason}) on {input.Jarea} hectares is {prediction:.2f}."
    }



# Load your trained crop recommendation model
crop_recommendation_model = joblib.load("models/crop_recommendation_model.joblib")

# --------- Input model for Crop Recommendation ----------
@app.get(
    "/crop_recommendation",
    operation_id="recommend_crop",
    summary="Recommend best crop based on soil and environmental parameters"
)
def recommend_crop(
    n_params: float,
    p_params: float,
    k_params: float,
    t_params: float,
    h_params: float,
    ph_params: float,
    r_params: float
) -> Dict[str, str]:
    """
    Predicts the best crop to cultivate based on input soil and environmental parameters.
    """

    # Prepare input for model as 2D array (1 sample)
    model_input = np.array([[n_params, p_params, k_params, t_params, h_params, ph_params, r_params]])
    
    # Debug print to verify input
    print("Model Input:", model_input)
    
    # Predict crop
    predicted_crop = crop_recommendation_model.predict(model_input)[0]

    return {
        "Predicted Crop": predicted_crop,
        "message": f"Based on the given parameters, the recommended crop is {predicted_crop}."
    }




# Load models and encoders
fertilizer_model = joblib.load("models/fertilizer_model.joblib")
soil_encoder = joblib.load("models/soil_encoder.joblib")
crop_encoder = joblib.load("models/encoder_yield.joblib")  # same encoder used in crop yield

# --------- Endpoint for Fertilizer Recommendation ----------
@app.get(
    "/fertilizer_recommendation",
    operation_id="recommend_fertilizer",
    summary="Recommend best fertilizer based on environmental and soil parameters"
)
def recommend_fertilizer(
    temp: float,
    humidity: float,
    moisture: float,
    soil_type: str,
    crop_type: str,
    nitrogen: float,
    potassium: float,
    phosphorous: float
) -> Dict[str, str]:
    """
    Predicts the best fertilizer to use based on input environmental and soil parameters.
    """

    # Encode categorical variables
    soil_encoded = soil_encoder.transform([[soil_type]])
    crop_encoded = crop_encoder.transform([[crop_type]])

    # Combine all inputs
    model_input = np.hstack([
        soil_encoded,
        crop_encoded,
        [[temp, humidity, moisture, nitrogen, potassium, phosphorous]]
    ])

    # Debug print to verify input
    print("Fertilizer Model Input:", model_input)

    # Predict fertilizer
    predicted_fertilizer = fertilizer_model.predict(model_input)[0]

    return {
        "Predicted Fertilizer": predicted_fertilizer,
        "message": f"Based on the given parameters, the recommended fertilizer is {predicted_fertilizer}."
    }



mcp = FastApiMCP(
    app,
    name="Agri Controller",
    description="MCP for BMI, Soil health, Crop Yield, Crop Recommendation, and Fertilizer Recommendation tools"
)
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
