'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { db } from "@/db";
import { attachments, users_progress, courses, modules, lessons, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, desc, ConsoleLogWriter } from "drizzle-orm";

export async function login(formData: any) {

    const supabase = createClient()

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

export async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut();

    if (error) {
        redirect('/error')
    }

    revalidatePath('/login', 'layout')
    redirect('/login')
}

export async function signup(formData: any) {
    const supabase = createClient()

    const data = {
        email: formData.email,
        password: formData.password,
        user_metadata: {
            firstName: formData.firstName,
            lastName: formData.lastName,
        },
        email_confirm: true,
    }

    const { error } = await supabase.auth.signUp(data);

    console.log(error);

    if (error) {
        redirect('/error')
    }

    revalidatePath('/login', 'layout')
    redirect('/login')
}