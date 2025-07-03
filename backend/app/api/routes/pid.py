from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pdfplumber
import io

router = APIRouter()

class AnalysisResponse(BaseModel):
    """Esquema de respuesta del análisis"""
    pipelines: int
    valves: int
    instruments: int

@router.post("/analyze-pid", response_model=AnalysisResponse)
async def analyze_pid(
    file: UploadFile = File(..., description="Archivo PDF del P&ID")
) -> AnalysisResponse:
    """
    Analiza un archivo P&ID y retorna los elementos encontrados
    
    Args:
        file: Archivo PDF del P&ID
        
    Returns:
        AnalysisResponse: Conteo de elementos encontrados
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        contents = await file.read()
        
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
            
            # Crear y retornar la respuesta usando el modelo Pydantic
            return AnalysisResponse(
                pipelines=len(text.split("PW")),
                valves=len(text.split("XV")),
                instruments=len(text.split("FIT"))
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing PDF: {str(e)}"
        )
    finally:
        await file.close()