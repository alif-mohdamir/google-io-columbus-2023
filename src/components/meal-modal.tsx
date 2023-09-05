import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import * as React from "react";
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
import { useToast } from "./ui/use-toast";

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
  const { name, description } = meal;

  const [{ text: recipeText, isFinishedLoading }, setRecipe] = React.useState({
    text: "",
    isFinishedLoading: true,
  });
  const [image, setImage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { toast } = useToast();

  const startLoading = () => {
    setLoading(true);
    setRecipe((prev) => {
      return {
        ...prev,
        text: "",
        isFinishedLoading: false,
      };
    });
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const generateImage = async () => {
    try {
      const prompt = `A photo of ${
        description ?? name
      } taken from far away. The entire meal is in the frame.`;

      const response = await fetch("api/generate-image", {
        method: "POST",
        body: JSON.stringify({
          prompt,
        }),
      });

      const responseData = await response.json();
      const { image } = responseData;
      if (!response.ok) {
        console.error("response => ", responseData);
        throw new Error("Error generating image");
      }

      setImage(image ?? "");
    } catch (e) {
      console.error(e);
    }
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

      if (!response.ok) {
        const responseData = await response.json();
        console.error("response => ", responseData);
        throw new Error("Error generating recipe");
      }

      const data = response.body;

      if (!data) {
        throw new Error("Error generating recipe");
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { done: doneStreaming, value } = await reader.read(); // read stream data
        done = doneStreaming;

        if (done) {
          setRecipe((prev) => {
            return {
              ...prev,
              isFinishedLoading: true,
            };
          });
          break;
        }
        const chunkValue = decoder.decode(value);

        setRecipe((prev) => {
          return {
            ...prev,
            text: prev.text + chunkValue,
          };
        });
      }
      stopLoading();
    } catch (e: any) {
      stopLoading();
      console.error(e);
      toast({
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const generateAudio = async () => {
    const audioElement = document.querySelector("audio");
    if (window.MediaSource && audioElement) {
      const mediaSource = new MediaSource();
      audioElement.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener("sourceopen", sourceOpen);
      mediaSource.addEventListener("sourceended", () => stopLoading());
    } else {
      console.log("The Media Source Extensions API is not supported.");
      throw new Error("Error generating audio");
    }
    async function sourceOpen(e: Event) {
      try {
        const mediaSource = e.target as MediaSource | null;
        if (!audioElement || !mediaSource) return;
        URL.revokeObjectURL(audioElement.src);
        const mime = `audio/mpeg`;

        const sourceBuffer = mediaSource.addSourceBuffer(mime);

        const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;
        // generate audio
        const elevenLabsRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
          {
            method: "POST",
            headers: {
              accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": process.env
                .NEXT_PUBLIC_ELEVENLABS_API_KEY as string,
            },
            body: JSON.stringify({
              text: recipeText,
              model_id: "eleven_monolingual_v1",
            }),
          },
        );

        if (!elevenLabsRes.ok) {
          const error = await elevenLabsRes.json();
          console.error("Error generating audio", error);
          throw new Error("Error generating audio");
        }

        const elevenlabsBody = elevenLabsRes.body;

        if (!elevenLabsRes.ok || !elevenlabsBody) {
          const error = await elevenLabsRes.json();
          console.error("Error generating audio:", error);
          throw new Error("Error generating audio");
        }

        const arrayOfBuffers: any[] = [];
        const dataReader = elevenlabsBody.getReader();

        let done = false;
        while (!done) {
          const { done: doneStreaming, value } = await dataReader.read(); // read stream data
          done = doneStreaming;

          if (done) {
            // if done, begin appending the data
            sourceBuffer.appendBuffer(arrayOfBuffers.shift());
            break;
          }
          // append the data to the buffer
          if (value) {
            arrayOfBuffers.push(value.buffer);
          }
        }

        sourceBuffer.addEventListener("updateend", function (e) {
          if (
            // make sure the source buffer is not updating and the media source is open
            !sourceBuffer.updating &&
            mediaSource?.readyState === "open"
          ) {
            if (arrayOfBuffers.length) {
              // if there is more data to append, append it
              sourceBuffer.appendBuffer(arrayOfBuffers.shift());
            } else {
              // if there is no more data to append, end the stream and play the audio
              mediaSource.endOfStream();
              audioElement.play();
            }
          }
        });
      } catch (error: any) {
        console.error(error);
        stopLoading();
      }
    }
  };

  const onGenerate = async () => {
    try {
      startLoading();
      await Promise.all([generateRecipe(), generateImage()]);
    } catch (e) {
      stopLoading();
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (recipeText.length && isFinishedLoading) {
      generateAudio();
    }
  }, [isFinishedLoading]);

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

  // reset recipe when meal changes
  React.useEffect(() => {
    setRecipe({ text: "", isFinishedLoading: true });
    setImage("");
  }, [meal]);

  const onPointerDownOutside = (
    e: CustomEvent<{
      originalEvent: PointerEvent;
    }>,
  ) => {
    if (loading) {
      e.preventDefault();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-left">
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={onPointerDownOutside}>
        <DialogHeader>
          <DialogTitle className="text-left">{name}</DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Button onClick={onGenerate} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Generate recipe"
          )}
        </Button>
      </DialogContent>

      {!!recipeText.length && (
        <DialogContent className="max-h-[75vh] overflow-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-left">{name} Recipe</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sm:hidden">
            {!!image.length && (
              <Image
                alt={name.toLowerCase()}
                height={256}
                width={256}
                src={image}
              />
            )}
          </DialogDescription>
          <div className="flex flex-col gap-8 relative">
            <div className="whitespace-pre-line">{recipeText}</div>
            <AudioPlayer onPlay={() => console.log("playing audio")} />

            <div className="absolute right-10 hidden sm:inline-block">
              {!!image.length && (
                <Image
                  alt={name.toLowerCase()}
                  height={256}
                  width={256}
                  src={image}
                />
              )}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
