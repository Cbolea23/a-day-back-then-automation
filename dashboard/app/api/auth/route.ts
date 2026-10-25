import {NextResponse} from "next/server";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: "admin" | "creator";
  avatarColor: string;
  createdAt: string;
  preferences?: {
    defaultArtStyle?: string;
    defaultNarratorTheme?: string;
    defaultNarratorTunic?: string;
    defaultNarratorAccent?: string;
    defaultVoice?: string;
    defaultLanguage?: string;
  };
};

function dataDir(): string {
  return process.env.DASH_DATA_DIR ?? path.join(process.cwd(), "data");
}

function usersFile(): string {
  return path.join(dataDir(), "users.json");
}

function sessionsFile(): string {
  return path.join(dataDir(), "sessions.json");
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

function readUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(usersFile())) return [];
    return JSON.parse(fs.readFileSync(usersFile(), "utf8")) as UserRecord[];
  } catch {
    return [];
  }
}

function writeUsers(users: UserRecord[]) {
  fs.mkdirSync(dataDir(), {recursive: true});
  fs.writeFileSync(usersFile(), JSON.stringify(users, null, 2), {mode: 0o600});
}

function readSessions(): Record<string, {userId: string; expiresAt: number}> {
  try {
    if (!fs.existsSync(sessionsFile())) return {};
    return JSON.parse(fs.readFileSync(sessionsFile(), "utf8"));
  } catch {
    return {};
  }
}

function writeSessions(sessions: Record<string, {userId: string; expiresAt: number}>) {
  fs.mkdirSync(dataDir(), {recursive: true});
  fs.writeFileSync(sessionsFile(), JSON.stringify(sessions, null, 2), {mode: 0o600});
}

function sanitizeUser(u: UserRecord) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarColor: u.avatarColor,
    createdAt: u.createdAt,
    preferences: u.preferences ?? {},
  };
}

function getCookieToken(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)adbt_session=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7).trim();
  return null;
}

export async function GET(req: Request) {
  const token = getCookieToken(req);
  const users = readUsers();
  if (!token) {
    return NextResponse.json({
      authenticated: false,
      hasAnyUsers: users.length > 0,
    });
  }

  const sessions = readSessions();
  const sess = sessions[token];
  if (!sess || sess.expiresAt < Date.now()) {
    return NextResponse.json({
      authenticated: false,
      hasAnyUsers: users.length > 0,
    });
  }

  const user = users.find((u) => u.id === sess.userId);
  if (!user) {
    return NextResponse.json({
      authenticated: false,
      hasAnyUsers: users.length > 0,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: sanitizeUser(user),
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    action?: "register" | "login" | "logout" | "update-preferences";
    name?: string;
    email?: string;
    password?: string;
    preferences?: UserRecord["preferences"];
  };

  const action = body.action || "login";
  const users = readUsers();
  const sessions = readSessions();

  if (action === "logout") {
    const token = getCookieToken(req);
    if (token && sessions[token]) {
      delete sessions[token];
      writeSessions(sessions);
    }
    const res = NextResponse.json({ok: true, authenticated: false});
    res.cookies.set("adbt_session", "", {httpOnly: true, path: "/", maxAge: 0});
    return res;
  }

  if (action === "update-preferences") {
    const token = getCookieToken(req);
    const sess = token ? sessions[token] : undefined;
    if (!sess) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    const idx = users.findIndex((u) => u.id === sess.userId);
    if (idx === -1) return NextResponse.json({error: "User not found"}, {status: 404});
    users[idx].preferences = {...(users[idx].preferences ?? {}), ...(body.preferences ?? {})};
    writeUsers(users);
    return NextResponse.json({ok: true, user: sanitizeUser(users[idx])});
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json({error: "Email and password are required."}, {status: 400});
  }

  if (action === "register") {
    if (password.length < 4) {
      return NextResponse.json(
        {error: "Password must be at least 4 characters long."},
        {status: 400},
      );
    }
    if (users.some((u) => u.email === email)) {
      return NextResponse.json(
        {error: "An account with this email already exists. Please log in instead."},
        {status: 409},
      );
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444"];
    const newUser: UserRecord = {
      id: `usr_${crypto.randomBytes(8).toString("hex")}`,
      name: (body.name || email.split("@")[0]).trim(),
      email,
      salt,
      passwordHash: hashPassword(password, salt),
      role: users.length === 0 ? "admin" : "creator",
      avatarColor: colors[users.length % colors.length],
      createdAt: new Date().toISOString(),
      preferences: {
        defaultArtStyle: "classic-cartoon",
        defaultNarratorTheme: "roman",
        defaultVoice: "en-US-ChristopherNeural",
        defaultLanguage: "en",
      },
    };

    users.push(newUser);
    writeUsers(users);

    const token = crypto.randomBytes(32).toString("hex");
    sessions[token] = {
      userId: newUser.id,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    writeSessions(sessions);

    const res = NextResponse.json({
      ok: true,
      authenticated: true,
      user: sanitizeUser(newUser),
      token,
    });
    res.cookies.set("adbt_session", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });
    return res;
  }

  // Login flow
  const user = users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json(
      {error: "Account not found. Click 'Create Account' to register first."},
      {status: 401},
    );
  }

  const hash = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return NextResponse.json({error: "Invalid password. Please try again."}, {status: 401});
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions[token] = {
    userId: user.id,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  writeSessions(sessions);

  const res = NextResponse.json({
    ok: true,
    authenticated: true,
    user: sanitizeUser(user),
    token,
  });
  res.cookies.set("adbt_session", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
