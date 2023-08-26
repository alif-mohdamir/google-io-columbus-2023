import openai

from bardapi import Bard

import os

class Model:
    def execute(self):
        pass

class ChatGpt35Turbo(Model):
    def __init__( self ):
      openai.api_key = os.getenv("OPENAI_API_KEY")
    
    def execute(self,ingredients = []):
        openai.ChatCompletion.create(
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

class Bard(Model):
    

    def execute(self,ingredients=[]):
        return Bard().get_answer(f"Give me 10 meals based on the following ingredients. Not all items need to be used: {', '.join(ingredients)}")['content']
