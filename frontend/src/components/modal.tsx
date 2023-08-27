import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ListItemButton, ListItemText, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { base64StringToBlob } from "@/utils";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 800,
  height: 800,
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 5,
};

interface ComponentProps {
  meal: { name: string; description: string };
  ingredients: any;
}

export default function BasicModal(props: ComponentProps) {
  let { meal, ingredients } = props;
  const [open, setOpen] = React.useState(false);
  // ref for audio player
  const ref = React.useRef<any>(null);
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);

  const [recipe, setRecipe] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => !loading && setOpen(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const generateRecipe = async () => {
    try {
      startLoading();
      ingredients = ingredients.map(({ value }: { value: string }) => value);
      const response = await fetch("api/generate-recipe", {
        method: "POST",
        body: JSON.stringify({
          selectedMeal: meal.name,
          ingredients,
          model: "",
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

  return (
    <>
      <ListItemButton className="normal-case" onClick={handleOpen}>
        <ListItemText primary={meal.name} />
      </ListItemButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {meal.name}
          </Typography>
          <Typography
            id="modal-modal-description"
            className="whitespace-pre-line"
          >
            {meal.description}
          </Typography>

          <LoadingButton
            variant="outlined"
            loading={loading}
            onClick={generateRecipe}
            className="normal-case w-40"
          >
            Generate recipe
          </LoadingButton>

          {recipe && (
            <Stack spacing={2}>
              <Typography
                id="modal-modal-description"
                className="whitespace-pre-line"
              >
                {recipe}
              </Typography>
              <AudioPlayer
                src={audio?.src}
                ref={ref}
                autoPlay
                onPlay={(e) => console.log("playing audio")}
              />
            </Stack>
          )}
        </Box>
      </Modal>
    </>
  );
}
