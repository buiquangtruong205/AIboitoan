import requests
import json

def test_validation():
    url = "http://localhost:8000/api/divination/ask"
    
    test_cases = [
        {"question": "abc", "desc": "Too short"},
        {"question": "aaaaaaaaaaaa", "desc": "Gibberish (repeated char)"},
        {"question": "bdfghjklmn", "desc": "Gibberish (no vowels)"},
        {"question": "asdfghjkl", "desc": "Gibberish (keyboard mash)"},
        {"question": "Tôi muốn xem bói", "desc": "Valid question"}
    ]
    
    for case in test_cases:
        print(f"Testing: {case['desc']} ('{case['question']}')")
        payload = {
            "question": case['question'],
            "type": "tarot"
        }
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                answer = response.json().get('answer', '')
                if "⚠️ **Thông báo:**" in answer:
                    print(f"  Result: BLOCKED - {answer}")
                else:
                    print(f"  Result: PASSED (Search triggered)")
            else:
                print(f"  Result: HTTP Error {response.status_code}")
        except Exception as e:
            print(f"  Result: Connection Error - {e}")
        print("-" * 30)

if __name__ == "__main__":
    test_validation()
