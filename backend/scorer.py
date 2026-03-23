import json
import os

def load_universities():
    path = os.path.join(os.path.dirname(__file__), "universities.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def score_gpa(student_gpa, required_gpa):
    if student_gpa >= required_gpa + 0.5:
        return 100
    elif student_gpa >= required_gpa:
        return 85
    elif student_gpa >= required_gpa - 0.3:
        return 60
    elif student_gpa >= required_gpa - 0.6:
        return 35
    else:
        return 10

def score_ielts(student_ielts, required_ielts):
    if student_ielts >= required_ielts + 0.5:
        return 100
    elif student_ielts >= required_ielts:
        return 85
    elif student_ielts == required_ielts - 0.5:
        return 40
    else:
        return 10

def score_research(has_research, research_required):
    if has_research:
        return 100
    elif not research_required:
        return 65
    else:
        return 20

def score_workex(years):
    if years >= 2:
        return 100
    elif years == 1:
        return 75
    else:
        return 45

def score_backlogs(backlogs):
    if backlogs == 0:
        return 100
    elif backlogs <= 2:
        return 60
    elif backlogs <= 4:
        return 30
    else:
        return 5

def calculate_match(student, university):
    gpa     = score_gpa(student["gpa"], university["min_gpa"]) * 0.35
    ielts   = score_ielts(student["ielts"], university["min_ielts"]) * 0.25
    research = score_research(student["has_research"], university["research_required"]) * 0.20
    workex  = score_workex(student["work_ex_years"]) * 0.10
    backlogs = score_backlogs(student["backlogs"]) * 0.10
    total = gpa + ielts + research + workex + backlogs
    return round(total, 1)

def get_tier(score):
    if score >= 78:
        return "Safe"
    elif score >= 55:
        return "Target"
    else:
        return "Ambitious"

def predict(student):
    universities = load_universities()
    field = student.get("field", "").lower()
    results = []
    for uni in universities:
        specializations_lower = [s.lower() for s in uni["specializations"]]
        if field and not any(field in s for s in specializations_lower):
            continue
        score = calculate_match(student, uni)
        results.append({
            "name": uni["name"],
            "city": uni["city"],
            "ranking": uni["ranking"],
            "tuition": uni["tuition"],
            "match_score": score,
            "tier": get_tier(score),
            "specializations": uni["specializations"]
        })
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return {
        "safe":      [r for r in results if r["tier"] == "Safe"],
        "target":    [r for r in results if r["tier"] == "Target"],
        "ambitious": [r for r in results if r["tier"] == "Ambitious"]
    }