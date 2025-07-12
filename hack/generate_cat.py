import json
from pathlib import Path

grouped_skills = {
    "programming": [
        "python", "java", "c++", "c#", "javascript", "typescript",
        "html", "css", "react", "vue.js", "angular", "next.js",
        "node.js", "express.js", "django", "flask", "fastapi",
        "spring boot", "dotnet"
    ],
    "data": [
        "sql", "mongodb", "firebase", "graphql", "rest api", "oop",
        "data structures", "algorithms", "git", "github", "docker",
        "kubernetes", "linux", "bash scripting", "excel", "excel macros",
        "powerbi", "tableau", "data analysis", "data visualization",
        "machine learning", "deep learning", "statistics", "pandas",
        "numpy", "scikit-learn", "matplotlib", "seaborn", "bigquery",
        "hadoop", "spark", "google analytics", "data storytelling",
        "data wrangling", "etl", "postgresql", "mysql", "snowflake", "airflow"
    ],
    "design": [
        "figma", "adobe xd", "sketch", "photoshop", "illustrator", "canva",
        "web design", "mobile ui design", "wireframing", "prototyping",
        "usability testing", "ux research", "a/b testing", "responsive design",
        "accessibility", "design systems", "color theory", "typography",
        "animation", "motion graphics"
    ],
    "soft": [
        "communication", "public speaking", "presentation skills", "teamwork",
        "leadership", "negotiation", "problem solving", "critical thinking",
        "adaptability", "creativity", "emotional intelligence", "time management",
        "conflict resolution", "collaboration", "decision making", "storytelling",
        "writing", "project management", "productivity"
    ],
    "business": [
        "seo", "sem", "digital marketing", "email marketing", "content writing",
        "copywriting", "market research", "branding", "growth hacking",
        "influencer marketing", "client management", "freelancing", "sales",
        "cold outreach", "pitching", "crm tools", "social media marketing",
        "facebook ads", "google ads"
    ],
    "tools": [
        "notion", "trello", "asana", "slack", "figjam"
    ]
}

flat_map = {}

for cat, skills in grouped_skills.items():
    for skill in skills:
        flat_map[skill.strip().lower()] = cat

out_file = Path("categories.json")
out_file.write_text(json.dumps(flat_map, indent=2), encoding="utf-8")
print(f"{len(flat_map)} skills saved to {out_file}")
