import { generateTokens,verifyAccessToken,isTokenBlacklisted } from "./jwt.js";
import bcrypt from 'bcryptjs';
export default{
  async fetch(request,env,ctx){
    const url = new URL(request.url);
    const path = url.pathname;

    const corsheaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if(request.method === 'OPTIONS'){
      return new Response(null,{headers:corsheaders})
    }

    try{
      let response;

      switch (path){
        case 'api/login':
          response = await handleLogin(request, env);;
          break;
        case 'api/verify-token':
          response = await handleVerifyToken(request, env); 
          break;
        case 'api/refresh-token':
          response = await handleRefreshToken(request, env);
          break;
        case 'api/logout':
          response = await handleLogout(request, env);
          break;
        default:
          return new Response('Not Found', { status: 404});
      }

      Object.entries(corsheaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }catch (error) {
      console.error('Api error', error);
      return new Response(JSON.stringify({error: 'Internal Server Error'}),{
        status : 500,
        headers: { ...corsheaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handleLogin(request, env) {
  if(request.method !== 'POST'){
    return new Response('Method Not Allowed', { status: 405 });
  }

  const {username,password} = await request.json();

  const clientIP = request.headers.get('CF-Connecting-IP') ||  'unknown';
  const rateLimiteKey = `rate_limit:${clientIP}`;
  const attempts = await env.RATE_LIMIT.get(rateLimiteKey);

  if(attemps && parseInt(attempts)>= 5){
    return new Response(JSON.stringify({error:'Trop de tentatives'}),{
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const user = await authenticateUser(username, password, env);
  if(!user){
    const newAttempts = attempts ? parseInt(attempts) + 1 : 1;
    await env.RATE_LIMIT.put(rateLimiteKey, newAttempts.toString(), { expirationTtl: 900 });

    return new Response(JSON.stringify({error: 'Invalid credentials'}), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await env.RATE_LIMIT.delete(rateLimiteKey);

  const tokens = await generateTokens({ 
    userId: user.id,
    username : user.username,
    role: user.role 
    }, env);

    await env.REFRESH_TOKENS.put(`refresh:${user.id}`, tokens.refreshToken, { expirationTtl: 604800 });

    return new Response(JSON.stringify({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }), {
      
      headers: { 'Content-Type': 'application/json' }
    });
}

async function handleVerifyToken(request, env) {
  const auth = request.headers.get('Authorization');
  if(!auth || !auth.startWith('Bearer')){
    return new Response(JSON.stringify({error:'Token manquanr'}),{
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = auth.slice(7);

  if(await isTokenBlacklisted(token, env)){
    return new Response(JSON.stringify({error: 'Token blacklisted'}), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const verification = await verifyAccessToken(token, env);

  if(!verification.success){
    return new Response(JSON.stringify({error: 'Token invalide'}), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    valid: true,
    user : verification.payload
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleLogout(request,env){
  const auth = request.headers.get('Authorization');
  if(!auth || !auth.startWith('Bearer')){
    const token = auth.slice(7);
    await blacklistToken(token, env);
  }

  return new Response(JSON.stringify({message: 'Déconnexion réussie'}), {
    headers: {'Content-Type': 'application/json'}
  });
}

async function authenticateUser(username, password,env){
  if(env.cashregisterdb){
    const user = await env.cashregisterdb.prepare("SELECT * FROM Utilisateur WHERE nom = ?")
      .bind(username)
      .first();

    if(user && await verifyPassword(password, user.password_hash)){
      return user;
    }
  }
  return null;
}

async function verifyPassword(password,hash){
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}