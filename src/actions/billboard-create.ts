'use server'

import { createBillboard } from '@/data/billboard'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import {
  TBillboardCreateUpdateSchema,
  BillboardCreateUpdateSchema,
} from '@/lib/validators/ActionValidators'

export async function createBillboardAction(
  values: TBillboardCreateUpdateSchema
) {
  const validatedFields = BillboardCreateUpdateSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthenticated' }
  }

  const { storeId, imageUrl, label } = validatedFields.data

  const existingStore = await getStoreByStoreAndUserId(storeId, user.userId)

  if (!existingStore) {
    return { error: 'Unauthorized' }
  }

  try {
    await createBillboard({ label, imageUrl, storeId })
    return { success: 'Billboard created successfully' }
  } catch (err) {
    return { error: 'Something went wrong, Please try again' }
  }
}
