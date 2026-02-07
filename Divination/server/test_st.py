print("Testing sentence_transformers import...")
try:
    from sentence_transformers import SentenceTransformer
    print("Import successful")
    print("Loading model 'all-MiniLM-L6-v2'...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Model loaded successfully")
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
