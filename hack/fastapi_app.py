from fastapi import FastAPI
from pydantic import BaseModel
from recommend import recommend_skills
import json

app = FastAPI(title="Skill Swap Recommender API", version="0.1.0", description="Backend ML service for skill‑swap recommendations")

class SkillRequest(BaseModel):
    skills: list[str]
    top_n: int = 3

@app.get("/")
def root():
    return {"message": "Skill Swap Recommender API is live! Use POST /recommend"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/categories")
def list_categories():
    with open("categories.json", "r", encoding="utf-8") as f:
        category_map = json.load(f)
    categories = sorted(list(set(category_map.values())))
    return {"categories": categories}

@app.post("/recommend")
def recommend_endpoint(request: SkillRequest):
    recommendations = recommend_skills(request.skills, request.top_n)
    return {
        "input": request.skills,
        "recommended": recommendations
    }
