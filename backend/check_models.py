import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
KEY = os.getenv("GEMINI_API_KEY")
print(f"Using Key: {KEY[:10]}...")
genai.configure(api_key=KEY)

try:
    print("Listing Models...")
    models = list(genai.list_models())
    for m in models:
        print(f"NAME: {m.name} | METHODS: {m.supported_generation_methods}")
except Exception as e:
    print(f"FAILED TO LIST: {e}")
