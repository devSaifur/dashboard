'use server'

import { lucia, validateRequest } from '@/auth/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  const { session } = await validateRequest()

  if (!session) {
    return {
      error: 'Unauthorized',
    }
  }
  try {
    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
    return redirect('/sign-in')
  } catch (err) {
    throw err
  }
}
