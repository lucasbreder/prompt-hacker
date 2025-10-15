import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../utils/util.fetch.api";
import { getCookieUtil } from "../utils/util.get.cookie";

export const useGetOpenAPI = (message?: string) => { // Tornar opcional

    const query = useQuery({
      queryKey: ["chat", message],
      enabled: !!message && message.trim() !== "", // Mais rigoroso
      queryFn: async () => {
        const sessionId = getCookieUtil('session_id')
        const data = await fetchAPI({
          url: '/ia/chat',
          method: "POST",
          body: {
              userText: message,
              sessionId: sessionId
          }
      });
      return data;
      },
      // Adicione estas configurações para melhor controle
      retry: false,
      staleTime: Infinity, // Não considerar os dados como stale
    });
  return query;
};