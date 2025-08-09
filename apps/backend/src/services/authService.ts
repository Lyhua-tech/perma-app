import { db } from "../server.js";
import { users, refresh_tokens } from "../db/schema.js";
import { comparePassword, hashPassword } from "../lib/bcrypt.js";
import { eq } from "drizzle-orm";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/jwttoken.js";
import { add } from "date-fns";

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: "inventory_manager" | "admin" | "inventory_owner" = "inventory_manager"
) => {
  const hashed_password = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      password_hash: hashed_password,
      role,
    })
    .returning();

  return user;
};

export async function findUserByEmail(email: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((r) => r[0] ?? null);
}

export async function findUserById(id: number) {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((r) => r[0] ?? null);
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) return null;

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user.id });

  // Persist refresh token with expiry
  const expiresAt = add(new Date(), { days: 7 });
  await db
    .insert(refresh_tokens)
    .values({ user_id: user.id, token: refreshToken, expires_at: expiresAt })
    .execute();

  return { user, accessToken, refreshToken };
}

export async function refreshTokens(token: string) {
  try {
    const decoded = verifyRefreshToken(token);
    const tokenRow = await db
      .select()
      .from(refresh_tokens)
      .where(eq(refresh_tokens.token, token))
      .then((r) => r[0] ?? null);
    if (!tokenRow || tokenRow.revoked) return null;
    if (new Date(tokenRow.expires_at) < new Date()) return null;

    const user = await findUserById(decoded.sub);
    if (!user) return null;

    // Optionally implement rotating refresh tokens: revoke old & insert new.
    const newAccess = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefresh = signRefreshToken({ sub: user.id });
    const expiresAt = add(new Date(), { days: 7 });

    // mark old token revoked
    await db
      .update(refresh_tokens)
      .set({ revoked: true })
      .where(eq(refresh_tokens.id, tokenRow.id))
      .execute();

    // insert new token
    await db
      .insert(refresh_tokens)
      .values({ user_id: user.id, token: newRefresh, expires_at: expiresAt })
      .execute();

    return { accessToken: newAccess, refreshToken: newRefresh };
  } catch (e) {
    return null;
  }
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refresh_tokens)
    .set({ revoked: true })
    .where(eq(refresh_tokens.token, token))
    .execute();
}
