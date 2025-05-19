// This function is called when a GET request is made to the /api/posts endpoint²
export async function onRequestGet(context) {
  // Remplace "DB" par le nom de ton binding si besoin (ex: cashregisterdb)
  const { results } = await context.env.cashregisterdb
    .prepare("SELECT * FROM Boisson")
    .all();
  return Response.json(results);
}

