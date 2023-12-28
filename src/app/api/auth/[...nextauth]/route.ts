import ConnectDB from '@/db/ConnectDB';
import User from '@/db/User';
import { clientId, clientSecret, scopesStr, secret } from '@/utils/secrets/secrets';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { cookies } from 'next/headers';


const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: clientId as string,
      clientSecret: clientSecret as string,
      authorization: {
        params: {
          scope: scopesStr as string,
          access_type: 'offline',
          response_type: "code",
        }
      }
    }),
  ],
  secret: secret,
  callbacks: {
    jwt: async ({ token, account, }: any) => {
      try {
        if (account && account?.access_token) token.access_token = account?.access_token;
        if (account && account?.refresh_token) token.refresh_token = account?.refresh_token;

        return token;

      } catch (error) {
        token.error = error;
        return error;
      }
    },

  },

  events: {
    signIn: async ({ user, account }: any) => {

      const cookieStore = cookies();

      if (account?.refresh_token) {
        await ConnectDB();

        cookieStore.set('rToken', account?.refresh_token, {
          expires: new Date(1000 * 60 * 60 * 24 * 30 * 6 + Date.now()).getTime(),
        });

        const dbuser = await User.findOne({ id: account?.providerAccountId });

        if (dbuser) {
          dbuser.rToken = account?.refresh_token as string;
          dbuser.tokenTime = new Date(1000 * 60 * 60 * 24 * 30 * 6 + Date.now()).getTime() as Number;
          await dbuser.save();
        }
        else {
          await User.create({
            id: account?.providerAccountId as string,
            email: user?.email as string,
            rToken: account?.refresh_token as string,
            tokenTime: new Date(1000 * 60 * 60 * 24 * 30 * 6 + Date.now()).getTime() as Number,
          });
        }
      }
      else {
        const rData = cookieStore.get('rToken') || null;
        const refreshToken = rData?.value;

        if (!refreshToken) {
          await ConnectDB();
          const dbuser = await User.findOne({ id: account?.providerAccountId });

          if (!dbuser) throw new Error("User not found")

          const rToken = dbuser?.refresh_token;
          const expiry = dbuser?.tokenTime;
          cookieStore.set('rToken', rToken, { expires: new Date(expiry).getTime() });
        }
      }

      if (account && account?.access_token) {
        cookieStore.set('aToken', account?.access_token, {
          expires: new Date(1000 * 60 * 30 + Date.now()).getTime(),
        });
      }

    }
    ,
    signOut: () => {
      const cookieStore = cookies();
      cookieStore.delete('aToken');
      cookieStore.delete('rToken');
    },
  }

}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
