import requests
import json

url = "http://127.0.0.1:8000/api/divination/ask"
payload = {
    "question": "Tôi thuộc cung Bảo Bình, hãy cho tôi biết về tính cách của mình.",
    "type": "horoscope"
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("Response Answer:")
        print(data.get("answer", "No answer found"))
    else:
        print("Error Response:")
        print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
