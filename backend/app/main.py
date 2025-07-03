from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import pid

app = FastAPI(title="PID Analyzer API")

# Configurar CORS de manera más permisiva para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, esto debería ser más específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(pid.router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "active", "message": "PID Analyzer API is running"}