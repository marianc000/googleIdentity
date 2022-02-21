import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.CLIENT_ID);
export async function verify(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return payload;
}
