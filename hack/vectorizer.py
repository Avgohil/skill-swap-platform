from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

# Load skills
with open("skills.txt", "r", encoding="utf-8") as f:
    skills = [line.strip().lower() for line in f if line.strip()]

print(f"Loaded {len(skills)} skills")

# Fit TF-IDF Vectorizer
vectorizer = TfidfVectorizer(analyzer='word', token_pattern=r'\w+')
skill_vectors = vectorizer.fit_transform(skills)

# Save all artifacts
with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

with open("skill_vectors.pkl", "wb") as f:
    pickle.dump(skill_vectors, f)

with open("skills_list.pkl", "wb") as f:
    pickle.dump(skills, f)

print("Vectorizer, skill vectors, and skills list saved successfully!")
