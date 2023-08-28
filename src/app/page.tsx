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
      ingredients: [{ value: "" }],
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
    <main className="flex flex-col gap-5 p-5">
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
        <div className="grid md:grid-flow-col grid-flow-row gap-10">
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(generateMeals)}>
              <Card>
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
                  >
                    Add ingredient
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Generate meals"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>

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
    </main>
  );
}
