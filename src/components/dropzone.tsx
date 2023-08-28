"use client";

import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

export default function StyledDropzone() {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({ accept: { "image/*": ["png", "jpg", "jpeg"] } });

  const style: React.CSSProperties = useMemo(
    () => ({
      ...baseStyle,
      // ...(isFocused ? { borderColor: palette.info.main } : {}),
      // ...(isDragAccept ? { borderColor: palette.success.main } : {}),
      // ...(isDragReject ? { borderColor: palette.error.main } : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="container">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </div>
      {fileRejections.length > 0 && (
        <div>
          <ol>
            {fileRejections.map(({ file, errors }) => (
              <li className="text-red-500 text-sm" key={file.name}>
                <div className="text-lg"> {file.name}</div>
                {errors.map((e) => (
                  <div key={e.code}>{e.message}</div>
                ))}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
