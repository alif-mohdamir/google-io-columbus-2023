import openai
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request, BackgroundTasks
from elevenlabs import generate, save

from model import ChatGpt35Turbo
from model import Bard

isBard = True


def getModel():
    if isBard == true:
        return Bard()

    return ChatGpt35Turbo()


app = FastAPI()

load_dotenv()
# Set your OpenAI API key here
openai.api_key = os.getenv("OPENAI_API_KEY")
elevenlabs_api = os.getenv("ELEVENLABS_API_KEY")


def generate_meals(ingredients):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {
                "role": "user",
                "content": f"Give me some meals based on the following ingredients. Not all items need to be used. {', '.join(ingredients)}",
            }
        ],
        temperature=1,
        max_tokens=1638,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )

    return response


def generate_recipe(selected_meal, ingredients):
    content = "test"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {
                "role": "user",
                "content": f"Give a recipe based on the following ingredients. Not all items need to be used. {', '.join(ingredients)}. ",
            },
            {"role": "assistant", "content": content},
            {"role": "user", "content": f"Provide me a recipe for {selected_meal}"},
        ],
        temperature=1,
        max_tokens=1638,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )

    return response


def generate_audio(text):
    voice = "3UP3Y85k1txx71jKRnZF"
    api_key = "24e080f7f717512bae3052ebc3c19ce9"
    model = "eleven_monolingual_v1"
    audio = generate(text=text,model=model, voice=voice, api_key=api_key)
    save(audio, 'output.mp3')



@app.post("/generate-meal")
async def generate_from_openai(payload: Request):
    data = await payload.json()
    ingredients = data["ingredients"]
    recommended_meals = generate_meals(ingredients=ingredients)

    return recommended_meals


@app.post("/provide-recipe")
async def provide_recipe(payload: Request, background_tasks: BackgroundTasks):
    data = await payload.json()
    selected_meal = data["meal"]
    ingredients = data["ingredients"]
    # Provide recipe based on the selected meal

    recipe = generate_recipe(selected_meal, ingredients=ingredients)

    # generate_audio(recipe["choices"][0]["message"]["content"])

    background_tasks.add_task(generate_audio, recipe["choices"][0]["message"]["content"])

    return recipe


@app.get("/health")
def health():
    return "hi there!"
