import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchAPI } from "./src/utils/util.fetch.api"; // Assumindo que este caminho está correto

export async function middleware(request: NextRequest) {
  const response = NextResponse.next(); 

  const cookiesScope = await cookies();
  const session = cookiesScope.get("session_id");

  if (!session) {
    try {
      const sessionData = await fetchAPI({
        method: 'POST',
        url: '/ia/session'
      });
      
      const newSessionId = sessionData.api_session_id;

      if (newSessionId) {
        response.cookies.set({
            name: 'session_id',
            value: newSessionId,
            // httpOnly: true, // Recomendado para segurança
            // secure: process.env.NODE_ENV === 'production', // Use 'secure' em produção
            maxAge: 60 * 60 * 24 * 7, // Exemplo: 1 semana
            path: '/',
        });
      }

    } catch (error) {
      console.error("Erro ao buscar a sessão:", error);
    }
  }
  return response;
}

export const config = {
  matcher: "/",
};