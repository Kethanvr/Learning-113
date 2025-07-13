import { conntodb } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import User from "@/modles/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions ={
	providers: [
		CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "email", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any) {
        if (!credentials.email || !credentials.password) {
            throw new Error("email or password is missing")
        }
         
        try {
            await conntodb();
            const user = await User.findOne({
                email: credentials.email,})
            if (!user) {
                throw new Error("user not found")
            }
            
            const isvalid = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (!isvalid) {
                throw new Error("password is incorrect");
            }

            return {
                id: user._id.toString(),
                email: user.email ,
            };
        } catch ( error) {
            console.error("Error connecting to the database:", error);
            throw new Error("Database connection failed");{
            
        }
     
    }
}})
	],
    
  callbacks: {
  
    async jwt({token,user }) {
        if(user){
            token.id=user.id
        }
      return token
    },
    async session({session,token}) {
        if(token){
            session.user.id = token.id as string;
        }
        return session
        }

}
}

