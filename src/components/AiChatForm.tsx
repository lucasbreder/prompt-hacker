import Image from "next/image";
import { Dispatch, Ref, SetStateAction } from "react";
import Cookies from "js-cookie";

export const AiChatForm = ({
  form,
  theme = "dark",
  placeholder,
  setCurrentUserMessage,
  setMessages,
  setShowChat,
}: {
  form: Ref<HTMLFormElement>;
  theme?: string;
  placeholder: string;
  setCurrentUserMessage: Dispatch<SetStateAction<string>>;
  setShowChat: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<
    SetStateAction<
      {
        type: string;
        message: string;
      }[]
    >
  >;
}) => {
  const darkTheme = "bg-transparent";
  const lightTheme = "bg-white text-secondary p-2 mt-4";
  const isGuided = Cookies.get("isGuided");

  return (
    <form
      ref={form}
      className="flex gap-2 w-full justify-between"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem("message") as HTMLInputElement;
        setShowChat(true);
        setCurrentUserMessage(input.value);
        if (!isGuided) {
          Cookies.set("isGuided", "true", {
            expires: 7, // Expira em 7 dias (o js-cookie usa dias como padrão)
            path: "/",
            secure: true, // Recomenda-se para produção
          });
        }

        setMessages((prev) => {
          return [
            ...prev,
            {
              type: "user",
              message: input.value,
            },
          ];
        });
      }}
    >
      <div
        className={`w-full flex items-center rounded-4xl ${theme === "dark" ? darkTheme : lightTheme}`}
        style={{
          boxShadow:
            theme === "light"
              ? `rgba(194, 194, 194, 0.38) 75px 20px 80px inset`
              : "",
        }}
      >
        <input
          autoComplete="off"
          name="message"
          className={`py-2 px-3 rounded-4xl flex-1 outline-none`}
          type="text"
          placeholder={placeholder}
        />
        <button className="cursor-pointer">
          <Image src="/icons/ai.png" width={24} height={18} alt="Menu" />
        </button>
      </div>
    </form>
  );
};
