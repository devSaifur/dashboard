import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { colors } from '@/db/schema'
import { TColorSchema } from '@/lib/validators/FormValidators'

export async function getColorById(id: string | null) {
  if (id) {
    return db.query.colors.findFirst({
      where: eq(colors.id, id),
    })
  }
}

export async function getColorsByStoreId(storeId: string) {
  return db.query.colors.findMany({
    where: eq(colors.storeId, storeId),
    orderBy: [desc(colors.createdAt)],
  })
}

export async function createColor(value: TColorSchema, storeId: string) {
  const colorArr = await db
    .insert(colors)
    .values({ storeId, updatedAt: new Date(), ...value })
    .returning()

  const [color] = colorArr
  return color
}

export async function deleteColorById(id: string) {
  const colorArr = await db.delete(colors).where(eq(colors.id, id)).returning()

  const [color] = colorArr
  return color
}

export async function updateColor(values: TColorSchema, colorId: string) {
  const colorArr = await db
    .update(colors)
    .set(values)
    .where(eq(colors.id, colorId))
    .returning()

  const [color] = colorArr
  return color
}
