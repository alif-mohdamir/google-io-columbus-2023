import React from "react";
import { FormikProps, useFormik } from "formik";
import * as yup from "yup";
import { TextField, TextFieldProps } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

// const validationSchema = yup.object({
//   value: yup.string().required("Text is required"),
// });

interface ComponentProps {}

export default function Input(props: ComponentProps & TextFieldProps) {
  const { ...other } = props;
  // const methods = useFormContext();

  return <TextField fullWidth {...other} />;
}
