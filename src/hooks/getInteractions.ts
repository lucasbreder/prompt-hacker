import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAPI } from "../utils/util.fetch.api";

export const useGetInteractions = (): UseQueryResult<number, Error> => {
  const query = useQuery({
    queryKey: ["interactions"],
    queryFn: async () => {
      const data = await fetchAPI({
        url: "/ia/interactions",
        isAiApi: true,
        method: "GET",
      });
      return data;
    },
  });
  return query;
};
