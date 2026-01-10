from fastapi import FastAPI
from fastapi.responses import FileResponse
from prometheus_fastapi_instrumentator import Instrumentator
import os

app = FastAPI()

# Initialize Prometheus instrumentation
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

PHOTOS_FOLDER = "photos"

@app.get("/")
def home():
    return {"message": "Welcome to the Home Page"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "photos-service"}

@app.get("/image/{image_name}")
def get_image(image_name: str):
    image_path = os.path.join(PHOTOS_FOLDER, image_name)
    if os.path.isfile(image_path):
        return FileResponse(image_path)
    return {"error": "Image not found"}