import { yupResolver } from "@hookform/resolvers/yup"
import { Button, TextField } from "@mui/material"
import React from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"

import {
  GetBudgetCategoriesDocument,
  useCreateBudgetCategoryMutation,
  useGetBudgetCategoryTypesQuery,
  useUpdateBudgetCategoryMutation,
} from "#api/budget"
import { BudgetCategory } from "#api/types"
import { RowGroup } from "#components/RowGroup"
import { RadioGroup } from "#components/form-contructor/RadioGroup"
import { useDialog } from "#components/useDialog"
import { IBoardsRouteParams } from "#views/boards/types"

import { FormField, FormValues, validationSchema } from "./form-helpers"

interface ICategoryFormModalProps {
  category: Pick<BudgetCategory, "id" | "name" | "type"> | undefined
}

export const CategoryFormModal: React.FC<ICategoryFormModalProps> = ({ category }) => {
  const params = useParams<IBoardsRouteParams>()

  const [BudgetCategoryFormDialog, , closeBudgetCategoryFormDialog] = useDialog({ id: "budget-category-form-dialog" })

  // ToDo: Note: It is encouraged that you set a defaultValue for all inputs to non-undefined
  // such as the empty string or null (https://react-hook-form.com/kr/v6/api/).
  const defaultValues = category === undefined ? { name: "" } : { name: category.name, typeId: category.type.id }

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  })

  const getBudgetCategoryTypesResult = useGetBudgetCategoryTypesQuery()
  const [createCategory] = useCreateBudgetCategoryMutation({
    refetchQueries: [{ query: GetBudgetCategoriesDocument, variables: { boardsIds: [Number(params.boardId)] } }],
  })
  const [updateCategory] = useUpdateBudgetCategoryMutation()

  if (!getBudgetCategoryTypesResult.data) return null

  const submitCategoryForm = handleSubmit(async (formValues) => {
    if (params.boardId === undefined) return
    try {
      if (category === undefined) {
        const result = await createCategory({
          variables: {
            boardId: Number(params.boardId),
            name: formValues.name,
            typeId: formValues.typeId,
          },
        })
        if (result.errors !== undefined) throw errors
      } else {
        const result = await updateCategory({
          variables: {
            boardId: Number(params.boardId),
            id: category.id,
            name: formValues.name,
            typeId: formValues.typeId,
          },
        })
        if (result.errors !== undefined) throw errors
      }
      closeBudgetCategoryFormDialog()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorFields = (error as any).graphQLErrors[0].extensions.exception.response.fields

      Object.entries(errorFields).forEach(([fieldName, error]) => {
        setError(fieldName as FormField, { type: "custom", message: error as string })
      })
    }
  })

  return (
    <BudgetCategoryFormDialog>
      <BudgetCategoryFormDialog.Header>
        {category ? "Edit category" : "Create category"}
      </BudgetCategoryFormDialog.Header>
      <BudgetCategoryFormDialog.Body>
        <form aria-label="budget-category-form" onSubmit={submitCategoryForm}>
          <RowGroup>
            <TextField
              {...register(FormField.Name)}
              error={errors.name !== undefined}
              helperText={errors.name?.message}
              label="Name"
            />
            <RadioGroup
              fieldValue={watch("typeId")}
              helperText={errors.typeId?.message}
              label="Category type"
              name={FormField.TypeId}
              options={getBudgetCategoryTypesResult.data.budgetCategoryTypes.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              register={register}
              setValue={setValue}
            />
          </RowGroup>
        </form>
      </BudgetCategoryFormDialog.Body>
      <BudgetCategoryFormDialog.Footer>
        <Button onClick={closeBudgetCategoryFormDialog}>Cancel</Button>
        <Button disabled={!isValid} type="submit">
          Submit
        </Button>
      </BudgetCategoryFormDialog.Footer>
    </BudgetCategoryFormDialog>
  )
}
