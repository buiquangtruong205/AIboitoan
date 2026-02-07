# Enhanced Tu Vi calculation with Mệnh (Element) for Vietnamese Lunar Calendar

CAN = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"]
CHI = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"]
MENH_NGU_HANH = ["Kim", "Thủy", "Hỏa", "Thổ", "Mộc"]

# Mapping for Mệnh Calculation
MO_CAN = {"Giáp": 1, "Ất": 1, "Bính": 2, "Đinh": 2, "Mậu": 3, "Kỷ": 3, "Canh": 4, "Tân": 4, "Nhâm": 5, "Quý": 5}
MO_CHI = {"Tý": 0, "Sửu": 0, "Ngọ": 0, "Mùi": 0, "Dần": 1, "Mão": 1, "Thân": 1, "Dậu": 1, "Thìn": 2, "Tỵ": 2, "Tuất": 2, "Hợi": 2}
MO_MENH = {1: "Kim", 2: "Thủy", 3: "Hỏa", 4: "Thổ", 5: "Mộc"}

def get_can_chi(year):
    can = CAN[year % 10]
    chi = CHI[year % 12]
    return can, chi

def get_menh(can, chi):
    val = MO_CAN.get(can, 0) + MO_CHI.get(chi, 0)
    if val > 5: val -= 5
    return MO_MENH.get(val, "N/A")

def calculate_tu_vi(day, month, year, hour, minute, gender):
    can, chi = get_can_chi(year)
    can_chi = f"{can} {chi}"
    menh = get_menh(can, chi)
    
    return {
        "lunar_date": f"Ngày {day} tháng {month} (Âm lịch dự kiến)",
        "can_chi_year": can_chi,
        "menh": menh,
        "gregorian_date": f"{day}/{month}/{year}",
        "time": f"{hour}:{minute}",
        "gender": "Nam" if gender == "male" else "Nữ"
    }
