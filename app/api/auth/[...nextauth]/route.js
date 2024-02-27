import Profile from "@components/Profile";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
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

  callbacks: {
    async session({ session }) {
      try {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (error) {
        console.error("Error fetching session user:", error);
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        // Serverless route, i.e., Lambda function
        await connectToDB();

        // Generate username
        let generatedUsername = profile.name.replace(/\s/g, "").toLowerCase();
        if (generatedUsername.length > 20) {
          generatedUsername = generatedUsername.substring(0, 20);
        }
        if (!generatedUsername) {
          generatedUsername = "user" + Math.random().toString(36).substr(2, 5);
        }

        // Check if a user already exists
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: generatedUsername,
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false; // Return false to indicate sign-in failure
      }
    },
  },
});

export { handler as GET, handler as POST };
