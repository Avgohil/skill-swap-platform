import json
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer

with open("categories.json", "r", encoding="utf-8") as f:
    category_map = json.load(f)

skills = list(category_map.keys())
print(f"Loaded {len(skills)} skills")

vectorizer = TfidfVectorizer(analyzer='word', token_pattern=r'\w+')
skill_vectors = vectorizer.fit_transform(skills)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("skill_vectors.pkl", "wb") as f:
    pickle.dump(skill_vectors, f)

with open("skills_list.pkl", "wb") as f:
    pickle.dump(skills, f)

print("Vectorizer, skill vectors, and skills list saved successfully!")
