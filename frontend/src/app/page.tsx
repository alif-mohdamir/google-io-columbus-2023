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
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [meals, setMeals] = useState<{ name: string; description: string }[]>(
    [],
  );
  const methods = useForm({
    shouldUnregister: true,
    shouldFocusError: true,
  });

  const [loading, setLoading] = useState(false);

  const [model, setModel] = useState("gpt-3.5-turbo");

  const { fields, append, remove } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
    shouldUnregister: true,
    rules: { required: true },
  });

  const addIngredient = () => {
    append({ value: "" });
  };

  const removeIngredient = (index: number) => () => {
    remove(index);
  };

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const generateMeals = async (data: FieldValues) => {
    try {
      startLoading();
      const ingredients = data.ingredients.map(
        ({ value }: { value: string }) => value,
      );

      const response = await fetch("api/generate-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.log("response => ", responseData);
        stopLoading();
        throw new Error("Network response was not ok");
      }

      const meals = responseData.meals;

      setMeals(meals);
      stopLoading();
    } catch (e) {
      stopLoading();
      console.error(e);
    }
  };

  // prevent user from leaving page while loading
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loading]);

  return (
    <main className="flex flex-col gap-5 p-5">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-between">
        <div className="grid md:grid-flow-col grid-flow-row gap-10">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(generateMeals)}>
              <Card>
                <CardHeader>
                  <CardTitle>Add ingredients</CardTitle>
                  <CardDescription>
                    Add all the ingredients in your kitchen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-4">
                    {fields.map(({ id }, index) => {
                      return (
                        <li key={id}>
                          <Form {...methods}>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                              <Input
                                id={id}
                                placeholder="e.g 1 cup of flour"
                                {...methods.register(
                                  `ingredients.${index}.value`,
                                  {
                                    validate: (value) => value !== "",
                                    required: "Ingredient can't be empty",
                                  },
                                )}
                                disabled={
                                  methods.formState.isSubmitting || loading
                                }
                              />

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={removeIngredient(index)}
                                disabled={
                                  methods.formState.isSubmitting || loading
                                }
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </Form>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter className="justify-between gap-2">
                  <Button
                    onClick={addIngredient}
                    disabled={methods.formState.isSubmitting}
                  >
                    Add ingredient
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      methods.formState.isSubmitting ||
                      !methods.formState.isValid
                    }
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Generate meals"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </FormProvider>

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
                      <MealModal
                        meal={meal}
                        ingredients={methods.getValues().ingredients}
                      />
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
