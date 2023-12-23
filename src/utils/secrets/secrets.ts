export const clientId = process.env.GOOGLE_CLIENT_ID;
export const clientSecret = process.env.GOOGLE_CLIENT_SECRET
export const scopes = ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.force-ssl', 'profile'];
export const scopesStr = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl';
export const redirectUrl = 'http://localhost:3000/api/auth/';
export const secret = process.env.NEXTAUTH_SECRET;
export const ytApi = process.env.YT_API;