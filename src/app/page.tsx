"use client";

import MealModal from "@/components/meal-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
  // FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormValues {
  model: string;
  ingredients: { value: string }[];
}

export default function Home() {
  const [meals, setMeals] = useState<{ name: string; description: string }[]>(
    [],
  );
  const methods = useForm<FormValues>({
    shouldUnregister: true,
    shouldFocusError: true,
    defaultValues: {
      model: "gpt-3.5-turbo-16k",
      ingredients: [],
    },
  });

  const isSubmitting = methods.formState.isSubmitting;
  const errors = methods.formState.errors;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "ingredients",
    shouldUnregister: true,
    rules: { required: "Ingredients must be added." },
  });

  const addIngredient = () => {
    append({ value: "" });
  };

  const removeIngredient = (index: number) => () => {
    remove(index);
  };

  const generateMeals = async (data: FieldValues) => {
    try {
      const ingredients = data.ingredients.map(
        ({ value }: { value: string }) => value,
      );

      const model = data.model;

      localStorage.setItem("lastUsedModel", model);
      localStorage.setItem("lastUsedIngredients", JSON.stringify(ingredients));

      const response = await fetch("api/generate-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          model,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.log("response => ", responseData);
        throw new Error("Network response was not ok");
      }

      const meals = responseData.meals;

      setMeals(meals);
    } catch (e) {
      console.error(e);
    }
  };

  // load last used model and ingredients
  useEffect(() => {
    const lastUsedModel = localStorage.getItem("lastUsedModel");
    const lastUsedIngredients = localStorage.getItem("lastUsedIngredients");

    if (lastUsedModel) {
      methods.setValue("model", lastUsedModel);
    }

    if (lastUsedIngredients) {
      const ingredients = JSON.parse(lastUsedIngredients);
      append(ingredients.map((value: string) => ({ value })));
    }
  }, []);

  // prevent user from leaving page while loading
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitting]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-5 p-5 sm:max-w-4xl w-full">
        <div className="flex justify-between">
          <Form {...methods}>
            <FormField
              control={methods.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>AI Model</FormLabel> */}
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>AI Models</SelectLabel>
                          <SelectItem value="gpt-3.5-turbo-16k">
                            GPT-3.5
                          </SelectItem>
                          <SelectItem value="palm">PaLM</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-between">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-5 w-full">
            <Card className="col-span-1 w-full">
              <Form {...methods}>
                <form onSubmit={methods.handleSubmit(generateMeals)}>
                  <CardHeader>
                    <CardTitle>Added ingredients</CardTitle>
                    <CardDescription>
                      Add all the ingredients in your kitchen.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-4">
                      {errors["ingredients"]?.root && (
                        <li className="text-red-500 text-sm">
                          {errors["ingredients"].root.message?.toString()}
                        </li>
                      )}
                      {fields.map(({ id }, index) => (
                        <li key={id}>
                          <FormField
                            control={methods.control}
                            name={`ingredients.${index}.value`}
                            rules={{ required: "Ingredient can't be empty" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input
                                      id={id}
                                      placeholder="e.g 1 cup of flour"
                                      disabled={isSubmitting}
                                      {...field}
                                    />

                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={removeIngredient(index)}
                                      disabled={isSubmitting}
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="justify-between gap-2">
                    <Button
                      variant="ghost"
                      onClick={addIngredient}
                      disabled={isSubmitting}
                      type="button" // prevent form submission
                    >
                      Add ingredient
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w h-4 w-4 animate-spin" />
                          <div>Generating meals</div>
                        </>
                      ) : (
                        "Generate meals"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            {meals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated meals</CardTitle>
                  <CardDescription>
                    Click a meal to generate a recipe.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul>
                    {meals.map((meal, index) => (
                      <li key={index}>
                        <MealModal meal={meal} methods={methods} />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
