from app.core.tu_vi_calcul import calculate_tu_vi

# Test case: 15/05/1990 10:30 Male
try:
    result = calculate_tu_vi(15, 5, 1990, 10, 30, "male")
    print("Calculation Successful:")
    for k, v in result.items():
        print(f"{k}: {v}")
except Exception as e:
    print(f"Calculation Failed: {e}")
