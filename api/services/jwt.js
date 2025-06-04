import { SignJWT, jwtVerify } from "jose";

export async function generateTokens(payload,env){
  if(!env.JWT_SECRET || !env.REFRESH_SECRET){
    throw new Error("JWT_SECRET and REFRESH_SECRET must be set in the environment variables");
  }
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const refreshSecret = new TextEncoder().encode(env.REFRESH_SECRET);

  const accesToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setIssuer("your-app")
    .setAudience("your-app-users")
    .sign(secret);

  const refreshToken = await new SignJWT({ 
    userId: payload.userId,
    type: "refresh"
  })
  .setProtectedHeader({ alg: "HS256", typ: "JWT" })
  .setIssuedAt()
  .setExpirationTime("7d")
  .setIssuer('your-app')
  .setAudience('your-app-users')
  .sign(refreshSecret);
  
  return {accesToken, refreshToken};

}

export async function verifyAccessToken(token,env){
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret,{
      issuer: 'your-app',
      audience: 'your-app-users'
    });
    return {success: true,payload};
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function blacklistToken(token,env){
  const tokenHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const hashString = Array.from(new Uint8Array(tokenHash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(''); 

  await env.TOKENBLACKLIST.put(hashString, "blacklisted", { expirationTtl: 86400});

}

export async function isTokenBlacklisted(token, env) {
  const tokenHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const hashString = Array.from(new Uint8Array(tokenHash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const blacklisted = await env.TOKEN_BLACKLIST.get(hashString);
  return blacklisted !== null;
}