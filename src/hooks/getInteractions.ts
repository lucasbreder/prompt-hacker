import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAPI } from "../utils/util.fetch.api";
import { NavItem } from "../types/Nav";

export const useGetInteractions = (
  message?: string
): UseQueryResult<number, Error> => {
  const query = useQuery({
    queryKey: ["interactions", message],
    enabled: !!message && message.trim() !== "", // Mais rigoroso
    queryFn: async () => {
      const data = await fetchAPI({
        url: "/ia/interactions",
        method: "GET",
      });
      return data;
    },
  });
  return query;
};
