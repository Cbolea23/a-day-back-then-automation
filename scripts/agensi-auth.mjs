import http from 'http';
import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const PORT = 8089;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const TOKEN_FILE = path.join(process.env.USERPROFILE || 'C:\\Users\\Christian Bolea', '.gemini', 'config', 'agensi_tokens.json');

function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function requestJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}),
        ...(options.headers || {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getOrCreateClient() {
  let clientId = null;
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
      if (saved.client_id) clientId = saved.client_id;
    } catch (e) {}
  }

  if (!clientId) {
    const regRes = await requestJson('https://mcp.agensi.io/oauth/register', {
      method: 'POST'
    }, JSON.stringify({
      client_name: 'Antigravity Agent',
      redirect_uris: [REDIRECT_URI]
    }));

    if (regRes.status === 201 && regRes.data.client_id) {
      clientId = regRes.data.client_id;
    } else {
      throw new Error('Failed to register OAuth client: ' + JSON.stringify(regRes));
    }
  }

  return clientId;
}

async function startOAuthFlow() {
  const clientId = await getOrCreateClient();
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = `https://www.agensi.io/oauth/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=read%20install&code_challenge=${encodeURIComponent(challenge)}&code_challenge_method=S256&state=${state}`;

  console.log('\n=========================================');
  console.log('AGENSI OAUTH SIGN-IN');
  console.log('=========================================');
  console.log('Please open this URL in your browser to sign in:');
  console.log('\n' + authUrl + '\n');
  console.log('Waiting for approval at http://localhost:8089/callback ...');

  // Attempt to open browser automatically
  exec(`start "" "${authUrl}"`, () => {});

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
      if (reqUrl.pathname === '/callback') {
        const code = reqUrl.searchParams.get('code');
        const err = reqUrl.searchParams.get('error');

        if (err) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`<h1>Authentication Failed</h1><p>${err}</p>`);
          server.close();
          reject(new Error(`OAuth error: ${err}`));
          return;
        }

        if (code) {
          try {
            console.log('Received auth code, exchanging for tokens...');
            const tokenRes = await requestJson('https://mcp.agensi.io/oauth/token', {
              method: 'POST'
            }, JSON.stringify({
              grant_type: 'authorization_code',
              client_id: clientId,
              code,
              redirect_uri: REDIRECT_URI,
              code_verifier: verifier
            }));

            if (tokenRes.status === 200 && tokenRes.data.access_token) {
              const tokenData = {
                client_id: clientId,
                access_token: tokenRes.data.access_token,
                refresh_token: tokenRes.data.refresh_token,
                token_type: tokenRes.data.token_type || 'Bearer',
                expires_in: tokenRes.data.expires_in,
                obtained_at: Date.now()
              };

              fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2), 'utf8');

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                  <h1 style="color: #22c55e;">Authentication Successful!</h1>
                  <p>Agensi has successfully connected to Antigravity.</p>
                  <p>You can close this tab and return to the chat.</p>
                </div>
              `);

              console.log('Tokens successfully saved to', TOKEN_FILE);
              server.close();
              resolve(tokenData);
            } else {
              res.writeHead(500, { 'Content-Type': 'text/html' });
              res.end(`<h1>Token Exchange Failed</h1><pre>${JSON.stringify(tokenRes.data, null, 2)}</pre>`);
              server.close();
              reject(new Error('Token exchange failed: ' + JSON.stringify(tokenRes)));
            }
          } catch (exchangeErr) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<h1>Error</h1><p>${exchangeErr.message}</p>`);
            server.close();
            reject(exchangeErr);
          }
        }
      }
    });

    server.listen(PORT, () => {
      console.log(`Local callback server listening on port ${PORT}`);
    });
  });
}

startOAuthFlow().catch(err => {
  console.error('Auth error:', err);
  process.exit(1);
});
