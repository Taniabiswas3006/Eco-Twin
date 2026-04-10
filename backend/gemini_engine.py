import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
AI_CACHE = {}

def get_ai_insight(prompt):
    if not GEMINI_KEY:
        return "Conscious living is a journey. Every eco-action counts."

    cache_key = prompt.strip().lower()
    if cache_key in AI_CACHE:
        return AI_CACHE[cache_key]

    # The Triple-Path Fallback logic
    candidates = [
        {"v": "v1beta", "m": "gemini-2.5-flash"},
        {"v": "v1beta", "m": "gemini-2.0-flash"},
        {"v": "v1beta", "m": "gemini-flash-lite-latest"},
        {"v": "v1", "m": "gemini-pro"},
        {"v": "v1beta", "m": "gemini-1.5-flash"}
    ]

    headers = {'Content-Type': 'application/json'}
    # Updated Persona: Descriptive, Simple, Actionable, Friendly
    system_instruction = (
        "Act as a friendly Sustainability Mentor. Use simple language. "
        "Explain WHY this footprint matters and give one EASY, practical tip. "
        "Keep it under 50 words and be very encouraging. "
    )
    payload = {"contents": [{"parts": [{"text": system_instruction + " USER DATA: " + prompt}]}]}

    for candidate in candidates:
        v = candidate['v']
        m = candidate['m']
        url = f"https://generativelanguage.googleapis.com/{v}/models/{m}:generateContent?key={GEMINI_KEY}"
        
        try:
            print(f"📡 Testing Next-Gen Path: {v}/{m}...")
            response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=8)
            
            if response.status_code == 200:
                data = response.json()
                text = data['candidates'][0]['content']['parts'][0]['text']
                AI_CACHE[cache_key] = text
                print(f"✅ FOUND STABLE PATH! Using model: {m}")
                return text
            else:
                print(f"   - {m} rejected (Code: {response.status_code})")
                
        except Exception:
            continue

    return "Every small adjustment in consumption leads to a sustainable digital twin."

if __name__ == "__main__":
    print(get_ai_insight("Hi"))