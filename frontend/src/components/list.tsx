import React from "react";
import { List as MuiList, ListItem, ListItemText } from "@mui/material";

const List = ({ items }: { items: Array<string> }) => {
  const placeholderItems = ["item 1", "item2"];

  const itemsToRender = items || placeholderItems;
  return (
    <MuiList sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {itemsToRender.map((item, index) => (
        <ListItem key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </MuiList>
  );
};

export default List;
