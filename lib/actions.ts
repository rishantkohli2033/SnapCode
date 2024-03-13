"use server";
import { signIn, signOut } from "@/auth";

export async function authAction() {
    try {
        await signIn("github"); //when successfull it calls redirect() which interally and by default throws an error
    } catch (error:any) {
        if(error.message === "NEXT_REDIRECT"){ //if error is redirect error we throw the error
            throw error;
        }
        return error.message;
    }
    
}

export async function logout(){
    await signOut();
}