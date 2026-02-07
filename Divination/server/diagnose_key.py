import requests
from app.core.config import settings
import json

def test_api_key():
    key = settings.GEMINI_API_KEY
    if not key:
        print("ERROR: No API Key found in settings/env.")
        return

    print(f"Testing API Key: {key[:5]}...{key[-5:]}")
    
    # 1. List Models via REST API
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
    print(f"Requesting: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            models = [m['name'] for m in data.get('models', []) if 'generateContent' in m.get('supportedGenerationMethods', [])]
            print("Available generation models:")
            for m in models:
                print(f" - {m}")
        else:
            print("Failed to list models.")
            print(response.text)
            
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_api_key()
