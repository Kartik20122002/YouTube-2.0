import { clientId, clientSecret, scopesStr, secret } from '@/utils/secrets/secrets';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { cookies } from 'next/headers';

const dynamic = 'force-dynamic'


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
    jwt: async ({ token, account , }: any) => {
      try {
        if (account && account?.access_token) {
          token.access_token = account?.access_token;
          console.log("\nAccess Token Generated");
          const cookieStore = cookies();
          cookieStore.set('aToken', token.access_token, {
            expires : new Date(1000*60*30 + Date.now()).getTime(),
          });
          console.log("\nACCESS TOKEN TILL", new Date(1000*60*30 + Date.now()).toLocaleString());
        }
        if (account && account?.refresh_token && !token?.refresh_token) {
          token.refresh_token = account?.refresh_token;
          console.log("\nRefresh Token Generated\n");
          const cookieStore = cookies();
          cookieStore.set('rToken', token.refresh_token, {
            expires : new Date(1000*60*60*24*30 + Date.now()).getTime(),
          });
          console.log("\nREFRESH TOKEN TILL", new Date(1000 * 60 * 60 * 24 * 30 + Date.now()).toLocaleString());
        }

        return token;

      } catch (error) {
        token.kartik = 'error kartik'
        return error;
      }

    },

  },
  events: {
    signOut: ()=> {
      const cookieStore = cookies();
      cookieStore.delete('aToken');
    }
  }

}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
