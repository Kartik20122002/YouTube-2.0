import {google} from 'googleapis';
import { clientId, clientSecret, redirectUrl } from '../secrets/secrets';

const OAuth2 = google?.auth?.OAuth2;

export const oauth2client = new OAuth2(
    clientId,
    clientSecret,
    redirectUrl,
)

export const youtube = google?.youtube({version : "v3" , auth : oauth2client });