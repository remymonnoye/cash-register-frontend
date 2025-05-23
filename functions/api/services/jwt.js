import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = 'votre_secret_tres_long_et_complexe-pipi';

export async function generateJWT(payload, expiresIn = "2h") {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJWT(token) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await jwtVerify(token, secret);
}