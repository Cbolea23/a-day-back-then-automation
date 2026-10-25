import fs from 'fs';
import https from 'https';
import path from 'path';

const TOKEN_FILE = path.join(process.env.USERPROFILE || 'C:\\Users\\Christian Bolea', '.gemini', 'config', 'agensi_tokens.json');

function getTokens() {
  if (!fs.existsSync(TOKEN_FILE)) throw new Error('Not authenticated with Agensi yet');
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
}

async function refreshTokens(tokens) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      grant_type: 'refresh_token',
      client_id: tokens.client_id,
      refresh_token: tokens.refresh_token
    });
    const req = https.request('https://mcp.agensi.io/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.access_token) {
            tokens.access_token = json.access_token;
            if (json.refresh_token) tokens.refresh_token = json.refresh_token;
            tokens.obtained_at = Date.now();
            fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2), 'utf8');
            resolve(tokens.access_token);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}

export async function callAgensiMcp(method, params = {}) {
  let tokens = getTokens();

  const makeReq = (token) => new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    });

    const req = https.request('https://mcp.agensi.io/mcp/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/event-stream'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const lines = data.split('\n');
        let parsed = null;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            try {
              parsed = JSON.parse(trimmed.slice(5).trim());
            } catch (e) {}
          }
        }
        if (!parsed) {
          try {
            parsed = JSON.parse(data.trim());
          } catch (e) {
            parsed = { raw: data, status: res.statusCode };
          }
        }
        resolve({ parsed, statusCode: res.statusCode });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });

  let res = await makeReq(tokens.access_token);
  if (res.statusCode === 401 && tokens.refresh_token) {
    const freshToken = await refreshTokens(tokens);
    if (freshToken) {
      res = await makeReq(freshToken);
    }
  }

  return res.parsed;
}

export async function callAgensiTool(name, args = {}) {
  return callAgensiMcp('tools/call', {
    name,
    arguments: args
  });
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('call-agensi-tool.mjs')) {
  const toolName = process.argv[2] || 'my_skills';
  let toolArgs = {};
  if (process.argv[3]) {
    try {
      toolArgs = JSON.parse(process.argv[3]);
    } catch (e) {
      toolArgs = { query: process.argv[3] };
    }
  }

  callAgensiTool(toolName, toolArgs)
    .then(res => console.log(JSON.stringify(res, null, 2)))
    .catch(err => console.error('Error:', err.message));
}
