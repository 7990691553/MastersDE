from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from scorer import predict
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "MastersDE API is running!"}

class StudentProfile(BaseModel):
    gpa: float
    ielts: float
    has_research: bool
    work_ex_years: int
    backlogs: int
    field: str = "ai"
    background: str = "Computer Science"
    sop_strength: str = "average"
    blocked_account: bool = False
    has_health_insurance: bool = False

@app.post("/predict")
def predict_universities(profile: StudentProfile):
    result = predict(profile.dict())
    return result