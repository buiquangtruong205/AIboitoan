import json
import os
from langchain_core.documents import Document
from app.core.rag_engine import rag_engine

def load_tarot_data():
    file_path = "data/tarot/cards.json"
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print("Loading Tarot data...")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    docs = []
    for item in data:
        content = f"Lá bài: {item['card']}\nÝ nghĩa: {item['meaning']}\nChiều xuôi: {item['upright']}\nChiều ngược: {item['reversed']}"
        docs.append(Document(page_content=content, metadata={"source": "cards.json", "card": item['card']}))
    
    rag_engine.add_documents(docs, domain="tarot")
    print(f"Loaded {len(docs)} Tarot documents.")

def load_horoscope_data():
    file_path = "data/horoscope/signs.json"
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print("Loading Horoscope data...")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    docs = []
    for item in data:
        content = f"Cung: {item['sign']}\nNguyên tố: {item['element']}\nĐặc điểm: {item['traits']}\nMô tả: {item['description']}"
        docs.append(Document(page_content=content, metadata={"source": "signs.json", "sign": item['sign']}))
    
    rag_engine.add_documents(docs, domain="horoscope")
    print(f"Loaded {len(docs)} horoscope documents.")

def load_tu_vi_data():
    files = ["data/tu_vi/general_meanings.txt", "data/tu_vi/years_data.txt"]
    docs = []
    
    for file_path in files:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue

        print(f"Loading Tu Vi data from {file_path}...")
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        sections = text.split("##")
        for section in sections:
            if section.strip():
                content = section.strip()
                title = content.split('\n')[0] if '\n' in content else "Unknown"
                docs.append(Document(page_content=content, metadata={"source": os.path.basename(file_path), "title": title}))
    
    if docs:
        rag_engine.add_documents(docs, domain="tu_vi")
    print(f"Loaded {len(docs)} Tu Vi documents in total.")

def load_all_data():
    load_tarot_data()
    load_horoscope_data()
    load_tu_vi_data()

if __name__ == "__main__":
    # Ensure we run from server root
    if not os.path.exists("data"):
        print("Please run this script from the 'server' directory.")
    else:
        load_all_data()
