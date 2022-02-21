import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.CLIENT_ID);
export function verify(idToken) {
  return client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID
  }).then(ticket => ticket.getPayload());
}
