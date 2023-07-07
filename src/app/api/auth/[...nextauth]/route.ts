import { refreshedToken } from '@/utils/auth/refreshed';
import { oauth2client } from '@/utils/auth/youtube';
import { clientId, clientSecret, scopesStr, secret } from '@/utils/secrets/secrets';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { signOut } from 'next-auth/react';

const getNewToken = async (token : any)=>{
  try {
    if(token.refresh_token){
      const newTokens = await refreshedToken(token.refresh_token);
      return newTokens;
    }
    else token.status = 404;

    return token;
  } catch (error) {
    return token;
  }
  
}

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
          token.expires_in = Date.now()*1000;
        }
        if(account && account?.refresh_token){
          token.refresh_token = account.refresh_token;
        }

        if(token.expires_in + 3500 <= Date.now()*1000){
          console.log('loading from here');
          const newTokens = await getNewToken(token);
          token.access_token = newTokens.access_token;
          token.expires_in = Date.now()*1000;
          return token;
        }
        else{ 
          token.expires_in = Date.now()*1000;
          token.status = 200;  
          return token;
        }
      } catch (error) {
        console.log('loggin from auth route' ,error);
        const newTokens = await getNewToken(token);
        token.access_token = newTokens.access_token;
        token.expires_in = Date.now()*1000;
        token.status = 405;
          return token;
        }

      },
    },
  }

const handler = NextAuth(authOptions);

export {handler as GET , handler as POST}
