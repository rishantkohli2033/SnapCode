import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { connectToMongoDB } from "./lib/db"
import { error } from "console";
import User, { IUserDocument } from "./models/userModel";
import mongoose from "mongoose";


export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [ GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
}) ],
secret: process.env.AUTH_SECRET, //cookies

callbacks: {
    async session({session}){ //to make _id available for getting users for sidebar
        try {
            await connectToMongoDB();
            if(session.user){
                const user = await User.findOne({email: session.user.email});
                if(user){
                    session.user._id = user._id;
                    return session;
                } else{
                    throw new Error("User not found");
                }
            } else {
                throw new Error("Invalid Session");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Invalid Session");
        }

    },
    async signIn({account, profile}){
        if(account?.provider === "github"){
            await connectToMongoDB();
            try {
                const user = await User.findOne({email: profile?.email});

                //sigup the user if not found
                if(!user){
                    const newUser = await User.create({
                        username: profile?.login,
                        fullName: profile?.name,
                        avatar: profile?.avatar_url,
                        email: profile?.email,
                    });

                    await newUser.save();
                }
                return true; //sign-in successful
            } catch (error) {
                console.log(error);
                return false; //sign-in failed
            }
        }
        return false; //sign-in failed
    }
}
})