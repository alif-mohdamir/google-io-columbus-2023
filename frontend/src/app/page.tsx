"use client";

// import Input from "@/components/input";
import { DeleteOutline } from "@mui/icons-material";
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
} from "@mui/material";
import {
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

export default function Home() {
  const { palette } = useTheme();
  const methods = useForm({
    shouldUnregister: true,
    shouldFocusError: true,
  });

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

  const onSubmit = (data: FieldValues) => {
    console.log("data", data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="max-w-md w-full flex flex-col">
            <List subheader="Ingredients" className="w-full">
              {fields.map((field, index) => {
                const ingredients = methods.formState.errors.ingredients as any;
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
                        // variant="standard"
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
              >
                Add ingredient
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                type="submit"
                sx={{ textTransform: "none" }}
              >
                Generate recipes
              </Button>
            </Stack>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
