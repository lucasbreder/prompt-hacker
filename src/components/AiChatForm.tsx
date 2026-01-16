"use client";
import Image from "next/image";
import { Dispatch, Ref, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
export const AiChatForm = ({
  form,
  theme = "dark",
  placeholder,
  setCurrentUserMessage,
  setMessages,
  setShowChat,
}: {
  form: RefObject<HTMLFormElement | null>;
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
  const [formVideoPosition, setFormVideoPosition] = useState(-65);
  const [placeholderString, setPlaceholderString] = useState(placeholder);
  const pathname = usePathname();

  return (
    <form
      ref={form}
      className={`flex gap-2 ${pathname === "/" ? "w-full" : "fixed bottom-5 left-1/2 translate-x-[-50%] w-[calc(100%-40px)] max-w-[1100px] mx-auto"} justify-between z-40`}
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
        className={`relative w-full flex items-center rounded-4xl ${pathname === "/" ? "h-12" : "h-16"} overflow-hidden ${theme === "dark" ? darkTheme : lightTheme}`}
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
          className={`py-2 px-6 rounded-4xl flex-1 outline-none absolute top-0 left-0 z-10 w-full pr-20 h-full bg-black/50 text-white placeholder-white`}
          type="text"
          placeholder={placeholderString}
          onFocus={() => {
            setFormVideoPosition(0);
            setPlaceholderString("")
          }}
          onBlur={() => {
            setFormVideoPosition(-65);
            setPlaceholderString("Alguma pergunta?")
          }}
        />
        <video className="transition-all duration-200 absolute w-[200%] border-white left-0 -z-0" src="/input.mp4" autoPlay loop muted style={{
          top: `${formVideoPosition}px`
        }} />
        <button className="cursor-pointer absolute top-0 right-0 h-full flex items-center justify-center p-5 z-20">
          <Image src={formVideoPosition === 0 ? "/icons/ai-send.png" : "/icons/ai.png"} width={30} height={18} alt="Menu" />
        </button>
      </div>
    </form>
  );
};
