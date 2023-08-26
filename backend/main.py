import openai
import os
from dotenv import load_dotenv
from fastapi import FastAPI

app = FastAPI()

load_dotenv()
# Set your OpenAI API key here
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_meals(ingredients):

    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-16k",
    messages=[
        {
        "role": "user",
        "content": f"Give me some meals based on the following ingredients. Not all items need to be used. {', '.join(ingredients)}"
        }
    ],
    temperature=1,
    max_tokens=1638,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )

    return response

def generate_receipe(selected_meal, ingredients):
    content="test"
    response = openai.Completion.create(
    model="gpt-3.5-turbo-16k",
    messages=[
        {
            "role": "user",
            "content": f"Give me some meals based on the following ingredients. Not all items need to be used. {', '.join(ingredients)}"
        },
        {
            "role": "assistant",
            "content": content
        },
        {
            "role": "user",
            "content": f"Provide me a recipe for {selected_meal}"
        }
    ],
    temperature=1,
    max_tokens=1638,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )

    return response

@app("/generate-meal")
def generate_from_openai():
    # List of ingredients you have
    my_ingredients = ["Jello", "honey", "bread", "walnuts", "peanuts", "chia", "seeds", "rice", "flour", "potatoes", "milk", "watermelon", "peanut butter", "greek yogurt", "mushrooms", "broccoli", "apples", "pancetta", "brussel", "sprouts", "sausage", "pork tenderloins"]

    recommended_meals = generate_meals(my_ingredients)
    print(recommended_meals) 

    return recommended_meals 

@app("/provide-receipe")
def provide_receipe():
    # Provide recipe based on the selected meal
    recipe = generate_receipe(selected_meal)

    selected_meal = "Jello"

    