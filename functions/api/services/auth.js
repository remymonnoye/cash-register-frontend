import { verifyJWT } from "./jwt.js";

export async function requireAuth(request, requiredRole = null) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }
  const token = auth.slice(7);
  const { payload } = await verifyJWT(token);

  if (requiredRole && payload.role !== requiredRole) {
    throw new Error("Forbidden");
  }
  return payload;
}