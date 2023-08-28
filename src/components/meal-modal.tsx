import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import * as React from "react";
import { base64StringToBlob } from "@/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";

interface ComponentProps {
  meal: { name: string; description: string };
  methods: UseFormReturn<
    {
      model: string;
      ingredients: {
        value: string;
      }[];
    },
    any,
    undefined
  >;
}

export default function MealModal(props: ComponentProps) {
  const { meal, methods } = props;
  // ref for audio player
  const ref = React.useRef<any>(null);
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);

  const [recipe, setRecipe] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const generateRecipe = async () => {
    try {
      startLoading();
      const { ingredients: ingredientsObjects, model } = methods.getValues();
      const ingredients = ingredientsObjects.map(
        ({ value }: { value: string }) => value,
      );
      const response = await fetch("api/generate-recipe", {
        method: "POST",
        body: JSON.stringify({
          selectedMeal: meal.name,
          ingredients,
          model,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.log("response => ", responseData);
        stopLoading();
        throw new Error("Network response was not ok");
      }

      const recipe: string | null = responseData.recipe;
      const base64Blob: string | undefined = responseData.base64Blob;

      if (base64Blob) {
        // Usage example
        const contentType = "audio/mpeg"; // Replace with the actual content type
        const blob = base64StringToBlob(base64Blob, contentType);

        // get audio from blob and play audio through audio player
        const audio = new Audio(URL.createObjectURL(blob));
        setAudio(audio);
      }
      setRecipe(recipe);

      stopLoading();
    } catch (e) {
      stopLoading();
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (audio && ref.current) {
      ref.current.audio.current.play();
    }
  }, [recipe]);

  // prevent user from leaving page while loading
  React.useEffect(() => {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{meal.name}</Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => loading && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{meal.name}</DialogTitle>
          <DialogDescription>{meal.description}</DialogDescription>
        </DialogHeader>

        <Button onClick={generateRecipe} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Generate recipe"
          )}
        </Button>
      </DialogContent>

      {recipe && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{meal.name} Recipe</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="whitespace-pre-line">{recipe}</div>
            <AudioPlayer
              src={audio?.src}
              ref={ref}
              autoPlay
              onPlay={() => console.log("playing audio")}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
