"use client";

import BasicModal from "@/components/modal";
// import Input from "@/components/input";
import { DeleteOutline } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  useTheme,
  Input,
  ListItemText,
  Modal,
} from "@mui/material";
import { useState } from "react";
import {
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

export default function Home() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const methods = useForm({
    shouldUnregister: true,
    shouldFocusError: true,
  });

  const [loading, setLoading] = useState(false);

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
      console.log("data", data);
      const ingredients = data.ingredients.map(
        ({ value }: { value: string }) => value
      );
      console.log("ingredients", ingredients);

      const response = await fetch("/python-path/generate-meal", {
        method: "POST",
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

      console.log("data => ", responseData);
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
            <div className="max-w-md w-full flex flex-col">
              <List subheader="Ingredients" className="w-full">
                {fields.map((field, index) => {
                  const ingredients = methods.formState.errors
                    .ingredients as any;
                  const errorValue = ingredients?.[index]?.value as any;

                  return (
                    <ListItem key={field.id}>
                      <ListItemIcon>
                        <Checkbox />
                      </ListItemIcon>
                      <FormControl fullWidth>
                        <Input
                          id={field.id}
                          placeholder="e.g 1 cup of flour"
                          error={Boolean(errorValue)}
                          {...methods.register(`ingredients.${index}.value`, {
                            validate: (value) => value !== "",
                            required: "Ingredient can't be empty",
                          })}
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
                    methods.formState.isSubmitting || !methods.formState.isValid
                  }
                >
                  Generate recipes
                </LoadingButton>
              </Stack>
            </div>
          </form>
        </FormProvider>
        {recipes.length > 0 && (
          <List subheader="Recipes" className="w-full">
            {recipes.map((recipe, index) => (
              <BasicModal
                key={index}
                label={`Recipe ${index + 1}`}
                recipe={recipe}
              />
            ))}
          </List>
        )}
      </div>
    </main>
  );
}
