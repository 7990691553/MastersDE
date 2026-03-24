from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from scorer import predict
from pydantic import BaseModel
from ai_advisor import analyze_profile, get_university_advice, ask_chatbot

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

class AnalyzeRequest(BaseModel):
    student: StudentProfile
    matched_universities: dict

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    result = analyze_profile(
        request.student.dict(),
        request.matched_universities
    )
    return {"advice": result}


class UniversityAdviceRequest(BaseModel):
    university_name: str
    student: StudentProfile

@app.post("/university-advice")
def university_advice(request: UniversityAdviceRequest):
    result = get_university_advice(
        request.university_name,
        request.student.dict()
    )
    return {"advice": result}


class ChatRequest(BaseModel):
    question: str
    student_context: dict = {}

@app.post("/chat")
def chat(request: ChatRequest):
    result = ask_chatbot(
        request.question,
        request.student_context
    )
    return {"answer": result}
