import { refreshedToken } from '@/utils/auth/refreshed';
import { oauth2client } from '@/utils/auth/youtube';
import { clientId, clientSecret, scopesStr, secret } from '@/utils/secrets/secrets';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';

const getNewToken = async (token : any)=>{
  const newTokens = await refreshedToken(token.refresh_token);
  token.access_token = newTokens.access_token;
  return token;
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
        }
        if(account && account?.refresh_token){
          token.refresh_token = account.refresh_token;
        }

        const access_token_details_res = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token.access_token}`);
        const access_token_details = await access_token_details_res.json();
        const expire_time = access_token_details.expires_in;

        if(expire_time < 50){
            return getNewToken(token);
        }
        else return token;
    
        } catch (error) {
          return getNewToken(token);
        }

      },
    },
  }

const handler = NextAuth(authOptions);

export {handler as GET , handler as POST}
