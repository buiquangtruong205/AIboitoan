from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
import asyncio
import os

# Force usage of specific transport if needed, or just standard test
async def test_model(model_name):
    print(f"Testing model: {model_name}")
    try:
        llm = ChatGoogleGenerativeAI(
            model=model_name, 
            google_api_key=settings.GEMINI_API_KEY,
            transport="rest"
        )
        response = await llm.ainvoke("Hello, are you working?")
        print(f"SUCCESS: {model_name}")
        print(response.content)
        return True
    except Exception as e:
        print(f"FAILED: {model_name}")
        print(f"Error: {e}")
        return False

async def main():
    models_to_test = [
        "gemini-1.5-flash", 
        "gemini-1.5-flash-latest",
        "gemini-pro", 
        "models/gemini-1.5-flash",
        "gemini-1.0-pro"
    ]
    
    for m in models_to_test:
        if await test_model(m):
            break

if __name__ == "__main__":
    asyncio.run(main())
