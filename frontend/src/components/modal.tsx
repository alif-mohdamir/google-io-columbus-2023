import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ListItemButton, ListItemText } from "@mui/material";
import { LoadingButton } from "@mui/lab";

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
  meal: string;
  label: string;
  ingredients: any;
}

export default function BasicModal(props: ComponentProps) {
  let { meal, label, ingredients } = props;
  const [open, setOpen] = React.useState(false);

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
      const response = await fetch("/python-api/provide-recipe", {
        method: "POST",
        body: JSON.stringify({
          meal,
          ingredients,
        }),
        mode: "no-cors",
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.log("response => ", responseData);
        stopLoading();
        throw new Error("Network response was not ok");
      }

      console.log("responseData", responseData);
      setRecipe(responseData.choices[0].message.content);
      stopLoading();
    } catch (e) {
      stopLoading();
      console.error(e);
    }
  };

  return (
    <>
      <ListItemButton className="normal-case" onClick={handleOpen}>
        <ListItemText primary={label} />
      </ListItemButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-description"
            className="whitespace-pre-line"
          >
            {meal}
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
            <Typography
              id="modal-modal-description"
              className="whitespace-pre-line"
            >
              {recipe}
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
}
