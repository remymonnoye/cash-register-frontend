export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/posts") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.cashregisterdb.prepare( "SELECT * FROM Customers", ).all();
      return Response.json(results);
    }

    return new Response(
      "Call /api/beverages to see everyone who works at Bs Beverages",
    );
  },
};