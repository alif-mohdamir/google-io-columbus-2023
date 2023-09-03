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
import Image from "next/image";

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
  const mealName = meal.name;
  // ref for audio player
  const ref = React.useRef<any>(null);
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);

  const [recipe, setRecipe] = React.useState<string | null>(null);
  const [image, setImage] = React.useState<string | null>(null);
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
          ingredients,
          model,
          meal,
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
      const image: string | undefined = responseData.image;
      if (base64Blob) {
        // Usage example
        const contentType = "audio/mpeg"; // Replace with the actual content type
        const blob = base64StringToBlob(base64Blob, contentType);

        // get audio from blob and play audio through audio player
        const audio = new Audio(URL.createObjectURL(blob));
        setAudio(audio);
      }
      setRecipe(recipe);
      setImage(image ?? null);
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
        <Button variant="link" className="text-left">
          {mealName}
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => loading && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-left">{mealName}</DialogTitle>
          <DialogDescription className="text-left">
            {meal.description}
          </DialogDescription>
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
        <DialogContent className="max-h-[75vh] overflow-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-left">{mealName} Recipe</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sm:hidden">
            {image && (
              <Image
                alt={mealName.toLowerCase()}
                height={128}
                width={128}
                src={image}
              />
            )}
          </DialogDescription>
          <div className="flex flex-col gap-2 relative">
            <div className="whitespace-pre-line">{recipe}</div>
            <AudioPlayer
              src={audio?.src}
              ref={ref}
              autoPlay
              onPlay={() => console.log("playing audio")}
            />
            {image && (
              <div className="absolute right-10 hidden sm:inline-block">
                <Image
                  alt={mealName.toLowerCase()}
                  height={128}
                  width={128}
                  src={image}
                />
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
