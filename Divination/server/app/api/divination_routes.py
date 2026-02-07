from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
from app.core.rag_engine import rag_engine
from typing import Optional
from app.core.tu_vi_calcul import calculate_tu_vi

router = APIRouter()

class DivinationRequest(BaseModel):
    question: str
    type: str = "horoscope" # horoscope, tu_vi, tarot
    birth_date: Optional[str] = None # DD/MM/YYYY
    birth_time: Optional[str] = None # HH:MM
    gender: Optional[str] = "male" # male, female

@router.post("/rebuild")
async def rebuild_rag_index():
    try:
        from app.core.data_loader import load_all_data
        load_all_data()
        return {"status": "success", "message": "RAG Index Rebuilt successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import google.generativeai as genai
import re

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    llm_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    llm_model = None

def is_meaningful_question(text: str) -> (bool, str):
    # ... (same as before)
    text = text.strip()
    if len(text) < 5:
        return False, "Câu hỏi quá ngắn. Bạn vui lòng nhập đầy đủ ý nghĩa hơn nhé (ít nhất 5 ký tự)."
    
    if len(set(text)) < 3 and len(text) > 8:
        return False, "Câu hỏi có vẻ lặp lại hoặc không có nghĩa. Bạn vui lòng kiểm tra lại."
    
    vowels = "aeiouyáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữự"
    vowel_count = sum(1 for char in text.lower() if char in vowels)
    if vowel_count == 0 and len(text) > 4:
        return False, "Câu hỏi không có nguyên âm hoặc có vẻ là viết tắt quá mức. Bạn vui lòng nhập tiếng Việt có dấu và đầy đủ nhé."
    
    if re.search(r'[^aeiouy\s]{5,}', text.lower()): 
        return False, "Câu hỏi chứa các ký tự lộn xộn. Bạn hãy đặt câu hỏi bằng từ ngữ rõ ràng nhé."

    return True, ""

@router.post("/ask")
async def ask_divination(request: DivinationRequest):
    try:
        # Validate entry
        is_valid, msg = is_meaningful_question(request.question)
        if not is_valid:
            return {
                "answer": f"⚠️ **Thông báo:** {msg}",
                "context": []
            }

        query_text = request.question
        chart_info = ""
        
        # 1. Gather User Bio Context
        if request.type == "tu_vi" and request.birth_date and request.birth_time:
            try:
                day, month, year = map(int, request.birth_date.split('/'))
                hour, minute = map(int, request.birth_time.split(':'))
                tu_vi_data = calculate_tu_vi(day, month, year, hour, minute, request.gender)
                
                chart_info = f"Thông tin Lá Số: Dương lịch {tu_vi_data['gregorian_date']}, Tuổi {tu_vi_data['can_chi_year']}, Bản Mệnh {tu_vi_data['menh']}"
                query_text = f"{request.question} (Bối cảnh: {chart_info})"
            except:
                pass

        # 2. Retrieve Relevant Knowledge
        context_docs = rag_engine.search(query_text, domain=request.type, k=5)
        
        if not context_docs:
            return {
                "answer": "Xin lỗi, hiện tại hệ thống chưa có đủ dữ liệu về câu hỏi này. Bạn hãy thử hỏi chi tiết hơn xem sao nhé!", 
                "context": []
            }

        context_text = "\n\n".join([doc.page_content for doc in context_docs])

        # 3. Synthesize Answer with Gemini
        if llm_model:
            try:
                prompt = f"""
Bạn là một chuyên gia về {request.type} (Tử vi, Chiêm tinh, Tarot). 
Nhiệm vụ của bạn là trả lời câu hỏi của người dùng dựa trên các thông tin được cung cấp dưới đây.

LƯU Ý QUAN TRỌNG:
- Trả lời bằng tiếng Việt, giọng văn nhẹ nhàng, sâu sắc, mang tính hướng dẫn và chữa lành.
- Nếu bối cảnh không đủ thông tin, hãy dùng kiến thức chuyên sâu của bạn về {request.type} để bổ sung nhưng phải giữ đúng tinh thần của dữ liệu gốc.
- Định dạng câu trả lời đẹp mắt bằng Markdown (sử dụng in đậm, danh sách gạch đầu dòng).
- Bắt đầu câu trả lời bằng một lời chào thân thiện.

[BỐI CẢNH DỮ LIỆU]:
{context_text}

[THÔNG TIN NGƯỜI DÙNG]:
{chart_info if chart_info else "Không có thông tin lá số cụ thể."}

[CÂU HỎI]:
{request.question}

Câu trả lời của bạn:
"""
                response = llm_model.generate_content(prompt)
                final_answer = response.text
                
                return {
                    "answer": final_answer,
                    "context": [doc.page_content for doc in context_docs]
                }
            except Exception as ai_err:
                print(f"Gemini AI Error: {ai_err}")
                # Fallback to raw chunks if AI fails
        
        # FALLBACK: Raw chunk display (Enhanced formatting)
        answer_parts = []
        if chart_info:
            answer_parts.append(f"📅 **{chart_info}**\n")
            
        header = {
            "horoscope": "🌟 **Phân tích Chiêm Tinh:**",
            "tu_vi": "🔮 **Luận giải Tử Vi:**",
            "tarot": "✨ **Thông điệp Tarot:**"
        }.get(request.type, "📜 **Kết quả dự đoán:**")
        
        answer_parts.append(header)
        for doc in context_docs:
            answer_parts.append(doc.page_content.strip())
            
        final_answer = "\n\n".join(answer_parts)

        return {
            "answer": final_answer, 
            "context": [doc.page_content for doc in context_docs]
        }

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
