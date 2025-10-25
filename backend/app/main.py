from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import clients, accounting, campaigns

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DBpartners CRM API",
    description="Accounting application with client management and marketing campaign tracking",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(clients.router)
app.include_router(accounting.router)
app.include_router(campaigns.router)

@app.get("/")
def read_root():
    return {
        "message": "DBpartners CRM API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
