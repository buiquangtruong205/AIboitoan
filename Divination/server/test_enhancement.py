import requests
import json

def test_divination():
    url = "http://localhost:8000/api/divination/ask"
    
    # Test Tarot
    print("Testing Tarot...")
    payload = {
        "question": "Tôi muốn biết về sự nghiệp trong tháng này",
        "type": "tarot"
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Tarot Success!")
        print(response.json()['answer'][:300] + "...")
    else:
        print(f"Tarot Failed: {response.status_code}")
        print(response.text)

    # Test Tu Vi
    print("\nTesting Tu Vi...")
    payload = {
        "question": "Vận hạn năm nay của tôi thế nào?",
        "type": "tu_vi",
        "birth_date": "15/05/1992",
        "birth_time": "08:30",
        "gender": "male"
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Tu Vi Success!")
        print(response.json()['answer'][:300] + "...")
    else:
        print(f"Tu Vi Failed: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_divination()
