import { youtube as youtubeAPI } from '@googleapis/youtube';
import { OAuth2Client } from 'googleapis-common';
import { clientId, clientSecret, redirectUrl } from '../secrets/secrets';

export const oauth2client = new OAuth2Client(clientId, clientSecret, redirectUrl);

export const youtube = youtubeAPI({ version: 'v3', auth: oauth2client as any });
