"use server";
import { signIn, signOut } from "@/auth";

export async function authAction() {
    await signIn("github");
}

export async function logout(){
    await signOut();
}