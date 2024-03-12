import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { connectToMongoDB } from "./lib/db"
import { error } from "console";
import User from "./models/userModel";
export const { handlers, auth } = NextAuth({ providers: [ GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
}) ],
secret: process.env.AUTH_SECRET, //cookies

callbacks: {
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