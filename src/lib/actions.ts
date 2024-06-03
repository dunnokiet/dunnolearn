'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: any) {


    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.email,
        password: formData.password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: any) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.email,
        password: formData.password
    }

    const { error } = await supabase.auth.signUp(data)


    if (error) {
        redirect('/error')
    }

    revalidatePath('/login', 'layout')
    redirect('/login')
}