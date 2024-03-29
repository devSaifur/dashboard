import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { sizes } from '@/db/schema'
import { TSizeSchema } from '@/lib/validators/FormValidators'

export async function getSizeById(id: string | null) {
  if (id) {
    return db.query.sizes.findFirst({
      where: eq(sizes.id, id),
    })
  }
}

export async function getSizesByStoreId(storeId: string) {
  return db.query.sizes.findMany({
    where: eq(sizes.storeId, storeId),
    orderBy: [desc(sizes.createdAt)],
  })
}

export async function createSize(value: TSizeSchema, storeId: string) {
  const sizeArr = await db
    .insert(sizes)
    .values({ storeId, updatedAt: new Date(), ...value })
    .returning()

  const [size] = sizeArr
  return size
}

export async function deleteSizeById(id: string) {
  const sizeArr = await db.delete(sizes).where(eq(sizes.id, id)).returning()

  const [size] = sizeArr
  return size
}

export async function updateSize(values: TSizeSchema, sizeId: string) {
  const sizeArr = await db
    .update(sizes)
    .set(values)
    .where(eq(sizes.id, sizeId))
    .returning()

  const [size] = sizeArr
  return size
}
