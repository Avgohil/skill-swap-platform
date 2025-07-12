import pickle
import numpy as np
import json
from sklearn.metrics.pairwise import cosine_similarity

with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("skill_vectors.pkl", "rb") as f:
    skill_vectors = pickle.load(f)

with open("skills_list.pkl", "rb") as f:
    skills = pickle.load(f)

with open("categories.json", "r", encoding="utf-8") as f:
    category_map = json.load(f)

def vectorize_skill(skill_text):
    return vectorizer.transform([skill_text.lower()])

def get_category(skill):
    return category_map.get(skill.lower(), "unknown")

def recommend_skills(user_skills, top_n=3):
    if isinstance(user_skills, list):
        user_skills = " ".join([s.lower() for s in user_skills])
    
    user_vec = vectorize_skill(user_skills)
    similarity_scores = cosine_similarity(user_vec, skill_vectors)
    similar_indices = np.argsort(similarity_scores[0])[::-1]

    exclude = [s.strip().lower() for s in user_skills.split()]
    input_cats = set(get_category(s) for s in exclude if get_category(s) != "unknown")
    
    recommendations = []

    for idx in similar_indices:
        skill = skills[idx]
        if skill not in exclude:
            skill_cat = get_category(skill)
            if not input_cats or (skill_cat in input_cats):
                recommendations.append({"skill": skill, "category": skill_cat})
        if len(recommendations) == top_n:
            break

    return recommendations

if __name__ == "__main__":
    input_skills = ["html", "css", "javascript"]
    result = recommend_skills(input_skills, top_n=5)
    print("Recommended Skills:", result)
