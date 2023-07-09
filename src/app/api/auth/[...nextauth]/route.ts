import { refreshedToken } from '@/utils/auth/refreshed';
import { oauth2client } from '@/utils/auth/youtube';
import { clientId, clientSecret, scopesStr, secret } from '@/utils/secrets/secrets';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { signOut } from 'next-auth/react';
import { cookies } from 'next/headers'

const getNewToken = async (token : any)=>{
  try {
    if(token.refresh_token){
      const newTokens = await refreshedToken(token.refresh_token);
      token.access_token = newTokens.access_token;
      token.expires_at = Date.now() + 3600*1000;
      token.status = 200;
      return token;
    }
    else token.status = 404;

    return token;
  } catch (error) {
    token.status = 404;
    return token;
  }
  
}

const dynamic = 'force-dynamic'


const authOptions : NextAuthOptions = {
    providers: [
      Google({
        clientId: clientId as string,
        clientSecret: clientSecret as string,
        authorization:{
          params:{
            scope: scopesStr as string,
            access_type : 'offline',
            response_type : 'code',
          }
        }
      }),
    ],

    secret : secret,

    callbacks: {
      jwt: async ({token , account } : any)=> {
        try {
        if (account && account?.access_token) {
          token.access_token = account.access_token;
          token.expires_at = account.expires_at;
          token.status = 200;
          const cookieHand = cookies();
          cookieHand.set('access' , account?.access_token);
          cookieHand.set('refresh',account?.refresh_token);
        }
        if(account && account?.refresh_token){
          token.refresh_token = account.refresh_token;
        }

        if(token.expires_at < Date.now()){
          return getNewToken(token);
        }


        return token;

      } catch (error) {
          token.kartik = 'error kartik'
          return error;
        }

      },

    },

  }

const handler = NextAuth(authOptions);

export {handler as GET , handler as POST}
