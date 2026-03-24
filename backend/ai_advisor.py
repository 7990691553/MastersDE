from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

def chat_with_groq(prompt: str, max_tokens: int = 1024) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens
    )
    return response.choices[0].message.content

def analyze_profile(student: dict, matched_universities: dict) -> str:
    safe_count = len(matched_universities.get("safe", []))
    target_count = len(matched_universities.get("target", []))
    ambitious_count = len(matched_universities.get("ambitious", []))
    top_safe = matched_universities.get("safe", [{}])[0].get("name", "None") if safe_count > 0 else "None"
    top_target = matched_universities.get("target", [{}])[0].get("name", "None") if target_count > 0 else "None"

    prompt = f"""You are an expert German university admissions counselor
specializing in helping Indian students apply to German universities
for Masters programs.

STUDENT PROFILE:
- GPA: {student['gpa']} / 10
- IELTS Score: {student['ielts']} bands
- Research Experience: {'Yes' if student['has_research'] else 'No'}
- Work Experience: {student['work_ex_years']} years
- Backlogs: {student['backlogs']}
- Field of Interest: {student['field']}
- Academic Background: {student['background']}
- SOP Strength (self-rated): {student.get('sop_strength', 'average')}
- Blocked Account Ready: {'Yes' if student.get('blocked_account') else 'No'}
- Health Insurance Arranged: {'Yes' if student.get('has_health_insurance') else 'No'}

MATCHING RESULTS:
- Safe universities found: {safe_count} (Top: {top_safe})
- Target universities found: {target_count} (Top: {top_target})
- Ambitious universities found: {ambitious_count}

Please provide:
1. OVERALL PROFILE ASSESSMENT (2-3 sentences, be honest)
2. TOP 3 STRENGTHS of this profile
3. TOP 3 WEAKNESSES and exactly how to fix each one
4. REALISTIC CHANCES for German MS admission
5. ONE SPECIFIC ACTION the student should take this month

Be direct, specific and helpful. Avoid generic advice. Focus on what
actually matters for German universities and Indian applicants."""

    return chat_with_groq(prompt, max_tokens=1024)


def get_university_advice(university_name: str, student: dict) -> str:
    prompt = f"""You are an expert German university admissions counselor
with deep knowledge of German universities and Indian student applications.

Give specific advice about {university_name} for this Indian student:

STUDENT PROFILE:
- GPA: {student['gpa']} / 10
- IELTS: {student['ielts']} bands
- Background: {student['background']}
- Field: {student['field']}
- Research: {'Yes' if student['has_research'] else 'No'}
- Work Experience: {student['work_ex_years']} years
- Backlogs: {student['backlogs']}

Please provide:
1. WHAT {university_name.upper()} LOOKS FOR from Indian applicants
2. REALISTIC ASSESSMENT of this student chances
3. WHAT TO HIGHLIGHT in the SOP for {university_name}
4. COMMON MISTAKES Indian students make when applying here
5. ONE INSIDER TIP most applicants miss

Keep it practical and specific. Max 300 words."""

    return chat_with_groq(prompt, max_tokens=600)


def ask_chatbot(question: str, student_context: dict = None) -> str:
    context = ""
    if student_context:
        context = f"""
Student context:
- GPA: {student_context.get('gpa', 'unknown')}
- IELTS: {student_context.get('ielts', 'unknown')}
- Field: {student_context.get('field', 'unknown')}
- Background: {student_context.get('background', 'unknown')}
"""

    prompt = f"""You are MastersDE, an AI assistant specialized in helping
Indian students apply to German universities for Masters programs.

You have deep knowledge about:
- German university admission requirements
- APS certificate requirements for Indian students
- German student visa process
- Blocked account requirements (11208 EUR per year)
- DAAD scholarships and funding options
- German language requirements (TestDaF, DSH)
- Life in Germany as an Indian student
- Job market in Germany after MS

{context}

Student question: {question}

Answer clearly and helpfully. Max 200 words. Use bullet points where helpful."""

    return chat_with_groq(prompt, max_tokens=400)
