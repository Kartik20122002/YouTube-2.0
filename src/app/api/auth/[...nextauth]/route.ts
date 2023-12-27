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
    signIn: ({account} : any) => {
      // console.log("\nSigned In\n", account?.refresh_token, "\n", account?.providerAccountId);

      if (account && account?.refresh_token) {
        const cookieStore = cookies();
          cookieStore.set('rToken', account?.refresh_token, {
            expires : new Date(1000*60*60*24*30*6 + Date.now()).getTime(),
          });
      }

      if (account && account?.access_token) {
          const cookieStore = cookies();
          cookieStore.set('aToken', account?.access_token, {
            expires : new Date(1000*60*50 + Date.now()).getTime(),
          });
        }
    }
    ,
    signOut: ()=> {
      const cookieStore = cookies();
      cookieStore.delete('aToken');
    },
  }

}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
