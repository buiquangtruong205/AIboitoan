import os
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from app.core.config import settings

class RAGEngine:
    def __init__(self):
        # Use local embeddings to avoid API Key dependency
        print("Initializing Local Embeddings (all-MiniLM-L6-v2)...")
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.horoscope_path = "./faiss_horoscope"
        self.tu_vi_path = "./faiss_tu_vi"
        self.tarot_path = "./faiss_tarot"
        
        self.horoscope_db = self._load_db(self.horoscope_path)
        self.tu_vi_db = self._load_db(self.tu_vi_path)
        self.tarot_db = self._load_db(self.tarot_path)

    def _load_db(self, path):
        if os.path.exists(path):
            try:
                return FAISS.load_local(path, self.embeddings, allow_dangerous_deserialization=True)
            except Exception as e:
                print(f"Error loading FAISS index from {path}: {e}")
                return None
        return None

    def _save_db(self, db, path):
        if db:
            db.save_local(path)

    def add_documents(self, documents, domain="horoscope"):
        if not documents:
            return
            
        if domain == "horoscope":
            if self.horoscope_db:
                self.horoscope_db.add_documents(documents)
            else:
                self.horoscope_db = FAISS.from_documents(documents, self.embeddings)
            self._save_db(self.horoscope_db, self.horoscope_path)
            
        elif domain == "tu_vi":
            if self.tu_vi_db:
                self.tu_vi_db.add_documents(documents)
            else:
                self.tu_vi_db = FAISS.from_documents(documents, self.embeddings)
            self._save_db(self.tu_vi_db, self.tu_vi_path)

        elif domain == "tarot":
            if self.tarot_db:
                self.tarot_db.add_documents(documents)
            else:
                self.tarot_db = FAISS.from_documents(documents, self.embeddings)
            self._save_db(self.tarot_db, self.tarot_path)

    def search(self, query, domain="horoscope", k=3):
        if domain == "horoscope":
            db = self.horoscope_db
        elif domain == "tu_vi":
            db = self.tu_vi_db
        else: # tarot
            db = self.tarot_db
        
        if db:
            return db.similarity_search(query, k=k)
        return []

# Singleton instance
rag_engine = RAGEngine()

# Auto-rebuild if databases are empty
if not rag_engine.horoscope_db or not rag_engine.tu_vi_db:
    print("WARNING: RAG Indices missing or incomplete. Triggering auto-rebuild...")
    try:
        from app.core.data_loader import load_all_data
        load_all_data()
        print("Auto-rebuild complete!")
    except Exception as e:
        print(f"Auto-rebuild failed: {e}")
        # Even if it fails, we continue so the server doesn't crash completely
