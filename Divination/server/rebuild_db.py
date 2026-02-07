import shutil
import os
import sys

# Add server root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.data_loader import load_all_data

def rebuild():
    print("Rebuilding Vector Database...")
    
    # Remove old indices
    if os.path.exists("faiss_horoscope"):
        shutil.rmtree("faiss_horoscope")
        print("Removed faiss_horoscope")
        
    if os.path.exists("faiss_tu_vi"):
        shutil.rmtree("faiss_tu_vi")
        print("Removed faiss_tu_vi")

    # Load data (this will use the new RAGEngine with HuggingFace embeddings)
    load_all_data()
    print("Rebuild Complete!")

if __name__ == "__main__":
    rebuild()
