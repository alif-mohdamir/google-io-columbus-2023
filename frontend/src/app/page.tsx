"use client";

import { Button } from "@mui/material";
import CheckboxLabels from "../components/checkbox";
import StyledDropzone from "@/components/dropzone";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-xl">
        <StyledDropzone />
      </div>
    </main>
  );
}
