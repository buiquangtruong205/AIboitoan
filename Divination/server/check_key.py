import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
print(f"Key: {key[:5]}...{key[-5:] if key else ''}")
if not key:
    print("KEY MISSING")
else:
    print("KEY PRESENT")
