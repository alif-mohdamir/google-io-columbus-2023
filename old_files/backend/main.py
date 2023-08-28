import openai
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request, BackgroundTasks
from elevenlabs import generate, save


from fastapi.middleware.cors import CORSMiddleware

from model import ChatGpt35Turbo
from model import BardModel

load_dotenv()

elevenlabs_api = os.getenv("ELEVENLABS_API_KEY")

def generate_audio(text):
    print("Calling generate")
    voice = "67NrdU0ydS84C9UBnZrH"
    model = "eleven_monolingual_v1"
    audio = generate(text=text,model=model, voice=voice, api_key=elevenlabs_api)
    save(audio, 'output.mp3')


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

@app.post("/provide-recipe")
async def provide_receipe(body: Request, background_tasks:BackgroundTasks):
     data = await body.json()


     recipe = getModel(data['model']).generate_recipe(data['selectedMeal'],data['ingredients'])

     if data['model'] == 'bard':
        background_tasks.add_task(generate_audio, recipe)
     else:
        background_tasks.add_task(generate_audio, recipe["choices"][0]["message"]["content"])

     return recipe


@app.get("/health")
def health():
    return "hi there!"
