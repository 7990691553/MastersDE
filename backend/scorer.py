import json
import os

def load_universities():
    path = os.path.join(os.path.dirname(__file__), "universities.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def score_gpa(student_gpa, required_gpa):
    diff = student_gpa - required_gpa
    if diff >= 0.5:
        return 100
    elif diff >= 0:
        return 85
    elif diff >= -0.3:
        return 55
    elif diff >= -0.7:
        return 30
    else:
        return 5

def score_ielts(student_ielts, required_ielts):
    diff = student_ielts - required_ielts
    if diff >= 0.5:
        return 100
    elif diff >= 0:
        return 85
    elif diff == -0.5:
        return 35
    else:
        return 5

def score_research(has_research, research_required):
    if has_research:
        return 100
    elif not research_required:
        return 60
    else:
        return 15

def score_workex(years):
    if years >= 2:
        return 100
    elif years == 1:
        return 70
    else:
        return 40

def score_backlogs(backlogs):
    if backlogs == 0:
        return 100
    elif backlogs <= 2:
        return 55
    elif backlogs <= 4:
        return 25
    else:
        return 0

def score_sop(sop_strength):
    mapping = {"strong": 100, "average": 65, "weak": 25}
    return mapping.get(sop_strength.lower(), 65)

def score_background(student_background, relevant_backgrounds):
    student_bg = student_background.lower()
    for bg in relevant_backgrounds:
        if student_bg in bg.lower() or bg.lower() in student_bg:
            return 100
    return 30

def calculate_match(student, university):
    gpa        = score_gpa(student["gpa"], university["min_gpa"]) * 0.30
    ielts      = score_ielts(student["ielts"], university["min_ielts"]) * 0.20
    research   = score_research(student["has_research"], university["research_required"]) * 0.15
    workex     = score_workex(student["work_ex_years"]) * 0.10
    backlogs   = score_backlogs(student["backlogs"]) * 0.10
    sop        = score_sop(student.get("sop_strength", "average")) * 0.10
    background = score_background(student.get("background", ""), university["relevant_backgrounds"]) * 0.05
    total = gpa + ielts + research + workex + backlogs + sop + background
    return round(total, 1)

def get_tier(score):
    if score >= 75:
        return "Safe"
    elif score >= 50:
        return "Target"
    else:
        return "Ambitious"

def check_visa_readiness(student):
    warnings = []
    if not student.get("blocked_account", False):
        warnings.append("Blocked account not ready — required for German student visa. You need approx 11,208 EUR.")
    if not student.get("has_health_insurance", False):
        warnings.append("Health insurance not arranged — mandatory for enrollment in Germany.")
    return warnings

def predict(student):
    universities = load_universities()
    field = student.get("field", "").lower()
    results = []
    for uni in universities:
        specs_lower = [s.lower() for s in uni["specializations"]]
        if field and not any(field in s for s in specs_lower):
            continue
        score = calculate_match(student, uni)
        results.append({
            "name": uni["name"],
            "city": uni["city"],
            "state": uni["state"],
            "ranking": uni["ranking"],
            "tuition": uni["tuition"],
            "match_score": score,
            "tier": get_tier(score),
            "specializations": uni["specializations"],
            "winter_deadline": uni["winter_deadline"],
            "summer_deadline": uni["summer_deadline"],
            "application_portal": uni["application_portal"],
            "notes": uni["notes"]
        })
    results.sort(key=lambda x: x["match_score"], reverse=True)
    visa_warnings = check_visa_readiness(student)
    return {
        "safe":          [r for r in results if r["tier"] == "Safe"],
        "target":        [r for r in results if r["tier"] == "Target"],
        "ambitious":     [r for r in results if r["tier"] == "Ambitious"],
        "visa_warnings": visa_warnings
    }