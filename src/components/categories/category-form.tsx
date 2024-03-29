'use client'

import axios, { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TBillboardSelectSchema } from '@/db/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modals'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CategorySchema,
  TCategorySchema,
} from '@/lib/validators/FormValidators'

interface CategoryFormProps {
  initialData: TCategorySchema | undefined
  billboards: TBillboardSelectSchema[]
}

export const CategoryForm = ({
  initialData,
  billboards,
}: CategoryFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const categoryId = params.categoryId as string

  const title = initialData ? 'Edit category' : 'Create category'
  const description = initialData ? 'Edit a category' : 'Add a new category'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<TCategorySchema>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    },
  })

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationKey: ['categories'],
    mutationFn: async (data: TCategorySchema) =>
      await axios.post(`/api/${storeId}/categories`, data),
    onSuccess: () => {
      toast.success('Category crated successfully')
      router.push(`/${storeId}/categories`)
      router.refresh()
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationKey: ['categories'],
    mutationFn: async (data: TCategorySchema) =>
      await axios.patch(`/api/${storeId}/categories/${categoryId}`, data),
    onSuccess: () => {
      toast.success('Category updated successfully')
      router.push(`/${storeId}/categories`)
      router.refresh()
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationKey: ['categories'],
    mutationFn: async () =>
      axios.delete(`/api/${storeId}/categories/${categoryId}`),
    onSuccess: () => {
      toast.success('Category deleted successfully')
      router.push(`/${storeId}/categories`)
      router.refresh()
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const isPending = isCreating || isUpdating || isDeleting

  function onSubmit(values: TCategorySchema) {
    if (initialData) {
      updateCategory(values)
    } else {
      createCategory(values)
    }
  }

  function onDelete() {
    deleteCategory()
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            onClick={() => setOpen(true)}
            variant="destructive"
            size="icon"
          >
            <Trash />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem value={billboard.id} key={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
