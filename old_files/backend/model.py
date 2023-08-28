import openai
import re


from bardapi import Bard

import os



class Model:
    def execute(self):
        pass
    def generate_recipe(self,selected_meal, ingredients):
        pass
    def generate_meals(self,ingredients = []):
        pass

class ChatGpt35Turbo(Model):
    def __init__( self ):
      openai.api_key = os.getenv("OPENAI_API_KEY")
    
    def generate_meals(self,ingredients = []):
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

        pattern = r'\d+\.\s*.*?:\s*.*?\\n'
        matches = re.findall(r'\d+\..*', response.choices[0].message.content)

        

        my_list = []
        for match in matches:

            description = ""

            split = match.split(":")

            name = re.sub(r'\d+\.\s*', '', match.split(":")[0])


            if len(split) > 1:
                description = match.split(":")[1].lstrip()

                
            my_list.append({
                'name':re.sub(r'\d+\.\s*', '', match.split(":")[0]),
                "description":description
            })
        return my_list


    def generate_recipe(self,selected_meal,ingredients = []):

        print(selected_meal)
        print(ingredients)
        content="test"
        response = openai.ChatCompletion.create(
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

class BardModel(Model):
    
    def generate_meals(self,ingredients=[]):
        response =  Bard().get_answer(f"Give me 10 meals based on the following ingredients. Not all items need to be used: {', '.join(ingredients)}")['content']

        print(response)


        pattern = r'\d+\.\s*.*?:\s*.*?\\n'
        matches = re.findall(r'\d+\..*', re.sub(r'\*','',response))

        my_list = []

        for match in matches:
            description = ""

            split = match.split(":")

            name = re.sub(r'\d+\.\s*', '', match.split(":")[0])


            if len(split) > 1:
                description = match.split(":")[1].lstrip()

                
            my_list.append({
                'name':name,
                "description":description
            })


        return my_list

    def generate_recipe(self,selected_meal,ingredients = []):
        print(selected_meal)
        response =  Bard().get_answer(f"Provide me a recipe for {selected_meal}")['content']

        print(response)

        return response