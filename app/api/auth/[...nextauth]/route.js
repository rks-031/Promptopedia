import Profile from "@components/Profile";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";

console.log({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ session }) {},
  async signIn({ Profile }) {
    try {
      //serverless route ,i.e, Lambda function
      await connectToDB();

      //check if a user already exists

      //if not, create a user

      return true;
    } catch (error) {
      console.log(error);
    }
  },
});

export { handler as GET, handler as POST };
