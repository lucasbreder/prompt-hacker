import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAPI } from "../utils/util.fetch.api";
import { NavItem } from "../types/Nav";

export const useGetNav = (
  message?: string
): UseQueryResult<NavItem[], Error> => {
  const query = useQuery({
    queryKey: ["chat", message],
    enabled: !!message && message.trim() !== "", // Mais rigoroso
    queryFn: async () => {
      const data = await fetchAPI({
        url: "/nav",
        method: "GET",
      });
      return data;
    },
  });
  return query;
};
