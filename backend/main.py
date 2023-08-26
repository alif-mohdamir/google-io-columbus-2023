import openai
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from elevenlabs import generate, save

from fastapi.middleware.cors import CORSMiddleware

from model import ChatGpt35Turbo
from model import BardModel

load_dotenv()



bard = BardModel()
chatGpt35Turbo = ChatGpt35Turbo()

def getModel(model=""):
    if model == "bard":
        return bard

    return chatGpt35Turbo


app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict HTTP methods if needed
    allow_headers=["*"],  # You can restrict headers if needed
)


@app.post("/generate-meal")
async def provide_meal(body: Request):

    data = await body.json()


    meals = getModel(data['model']).generate_meals(data['ingredients'])

    return meals

@app.post("/provide-receipe")
def provide_receipe(body: Request):
    # Provide recipe based on the selected meal
    # recipe = generate_receipe(selected_meal)


    print(body.model)
    print(body.selectedMeal)
    # selected_meal = "Jello"

    return "hi"


@app.get("/health")
def health():
    return "hi there!"
