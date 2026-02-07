import sys
import os
print(f"Python Executable: {sys.executable}")
print("Sys Path:")
for p in sys.path:
    print(p)

try:
    import lunardate
    print(f"Lunardate found at: {lunardate.__file__}")
except ImportError as e:
    print(f"Lunardate Import failed: {e}")
