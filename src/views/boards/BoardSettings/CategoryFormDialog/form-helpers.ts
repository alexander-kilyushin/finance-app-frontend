import * as yup from "yup"

export enum FieldName {
  Name = "name",
  TypeId = "typeId",
}

export const validationSchema = yup
  .object({
    name: yup.string().required(),
    typeId: yup.number().required(),
  })
  .required()

export type TFormValues = yup.InferType<typeof validationSchema>
