"use client";

import BasicModal from "@/components/modal";
import { DeleteOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  Stack,
  Input,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import {
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

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

  const removeIngredient = (index: number) => () => {
    remove(index);
  };

  const { fields, append, remove } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
    shouldUnregister: true,
    rules: { required: true },
  });

  const addIngredient = () => {
    append({ value: "" });
  };

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const onSubmit = async (data: FieldValues) => {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={4}>
              <div className="max-w-md w-full flex flex-col gap-5">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Model</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    label="Model"
                    onChange={(e) => setModel(e.target.value as string)}
                  >
                    <MenuItem value={"gpt-3.5-turbo"}>GPT-3.5-Turbo</MenuItem>
                    <MenuItem value={"bard"}>Bard</MenuItem>
                  </Select>
                </FormControl>
                <List subheader="Ingredients" className="w-full">
                  {fields.map((field, index) => {
                    const ingredients = methods.formState.errors
                      .ingredients as any;
                    const errorValue = ingredients?.[index]?.value as any;

                    return (
                      <ListItem key={field.id}>
                        <FormControl fullWidth>
                          <Input
                            id={field.id}
                            placeholder="e.g 1 cup of flour"
                            error={Boolean(errorValue)}
                            {...methods.register(`ingredients.${index}.value`, {
                              validate: (value) => value !== "",
                              required: "Ingredient can't be empty",
                            })}
                            disabled={methods.formState.isSubmitting || loading}
                          />
                          {errorValue && (
                            <FormHelperText error>
                              {errorValue?.message}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={removeIngredient(index)}
                          disabled={methods.formState.isSubmitting || loading}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </ListItem>
                    );
                  })}
                </List>
                <Stack direction="row" spacing={2}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={addIngredient}
                    sx={{ textTransform: "none" }}
                    disabled={methods.formState.isSubmitting}
                  >
                    Add ingredient
                  </Button>
                  <LoadingButton
                    color="secondary"
                    variant="outlined"
                    type="submit"
                    loading={loading}
                    sx={{ textTransform: "none" }}
                    disabled={
                      methods.formState.isSubmitting ||
                      !methods.formState.isValid
                    }
                  >
                    Generate meals
                  </LoadingButton>
                </Stack>
              </div>
            </Stack>
          </form>
        </FormProvider>
        {meals.length > 0 && (
          <List subheader="Meals" className="w-full gap-2 flex flex-col">
            {meals.map((meal, index) => (
              <ListItem className="rounded" key={index}>
                <BasicModal
                  // label={`Meal ${index + 1}`}
                  meal={meal}
                  ingredients={methods.getValues().ingredients}
                />
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </main>
  );
}
