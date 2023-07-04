import { oauth2client } from '@/utils/auth/youtube';
import { clientId, clientSecret, scopesStr, secret } from '@/utils/secrets/secrets';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const refreshedToken = async (token : any)=>{
  return token;
}

export const authOptions = {
    providers: [
      Google({
        clientId: clientId as string,
        clientSecret: clientSecret as string,
        authorization:{
          params:{
            scope: scopesStr as string,
            // prompt: 'consent',
            access_type : 'offline',
            response_type : 'code',
          }
        }
      }),
    ],

    secret : secret,

    callbacks: {
      jwt: ({token , account } : any)=> {

        if (account && account?.access_token) {
          token.access_token = account.access_token;
          token.expires_at = Date.now() + account.expires_at*1000;
        }
        if(account && account?.refresh_token){
          token.refresh_token = account.refresh_token;
        }

        if(token?.expires_at > Date.now())
        return token;

        return refreshedToken(token);
      },
    },
  }

const handler = NextAuth(authOptions);

export {handler as GET , handler as POST}
