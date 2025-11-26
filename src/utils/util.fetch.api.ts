export async function fetchAPI({
  url,
  method = "GET",
  body,
  dataType = "json",
  isAiApi = false,
}: {
  url: string;
  method?: string;
  dataType?: "json" | "formData";
  body?: any;
  isAiApi?: boolean;
}) {
  const headers: Record<string, string> = {};

  if (dataType === "json") {
    headers["Content-Type"] = "application/json";
  }

  //Faz a requisição
  const response = await fetch(
    isAiApi
      ? process.env.NEXT_PUBLIC_API_AI_URL + url
      : process.env.NEXT_PUBLIC_API_URL + url || "",
    {
      method,
      headers,
      body: dataType === "json" ? JSON.stringify(body) : body,
    }
  );
  //Pega o resultado
  const result = await response.json();

  //Caso não seja ok, lança um erro
  if (!response.ok) {
    throw new Error(result.message ?? "Network response was not ok");
  }
  //Retorna o resultado
  return result;
}
