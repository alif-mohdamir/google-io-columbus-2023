import openai
import os
from dotenv import load_dotenv


load_dotenv()
# Set your OpenAI API key here
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_meals(ingredients):

    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-16k",
    messages=[
        {
        "role": "user",
        "content": f"Give me 10 meals based on the following ingredients. Not all items need to be used: {', '.join(ingredients)}"
        }
    ],
    temperature=1,
    max_tokens=1638,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )

    return response

# List of ingredients you have
my_ingredients = ["Jello", "honey", "bread", "walnuts", "peanuts", "chia", "seeds", "rice", "flour", "potatoes", "milk", "watermelon", "peanut butter", "greek yogurt", "mushrooms", "broccoli", "apples", "pancetta", "brussel", "sprouts", "sausage", "pork tenderloins"]

recommended_meals = generate_meals(my_ingredients)
print(recommended_meals) 




