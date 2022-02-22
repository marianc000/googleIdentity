import { OAuth2Client } from 'google-auth-library';

app.post('/login', async function (req, res) {
    const user = await verify(req.body.credential);
    req.session.regenerate(() => {
        req.session.user = user;
        res.redirect('/');
    });
})

const client = new OAuth2Client(process.env.CLIENT_ID);
function verify(idToken) {
    return client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID
    }).then(ticket => ticket.getPayload());
}
