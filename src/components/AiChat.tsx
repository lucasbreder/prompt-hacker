"use client";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGetOpenAPI } from "@/src/hooks/getOpenAi";
import Markdown from "react-markdown";
import { AiChatForm } from "./AiChatForm";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { AiInteractions } from "./AiInteractions";
import { AiMessages } from "./AiMessages";
import { useGetInteractions } from "../hooks/getInteractions";

export const AiChat = ({
  theme = "dark",
  placeholder = "Alguma pergunta?",
  setShowParent,
  isFixed = true,
  isAtBottom = false,
  isFloat = true,
}: {
  theme?: "dark" | "light";
  placeholder?: string;
  setShowParent?: Dispatch<SetStateAction<boolean>>;
  isFixed?: boolean;
  isAtBottom?: boolean;
  isFloat?: boolean;
}) => {
  const [messages, setMessages] = useState<{ type: string; message: string }[]>(
    []
  );
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const chat = useRef<HTMLDivElement>(null);
  const iaResponse = useGetOpenAPI(currentUserMessage);
  const router = useRouter();
  const interactions = useGetInteractions()

  const handleLinkClick = useCallback(
    (event: any) => {
      if (!(event.target instanceof Element)) return;

      const target = event.target.closest("a") as HTMLAnchorElement | null;

      if (target) {
        const href = target.getAttribute("href");
        if (
          href &&
          !href.startsWith("http") &&
          !href.startsWith("https") &&
          !target.hasAttribute("download")
        ) {
          event.preventDefault();
          router.push(href);
          setShowChat(false);
        }
      }
    },
    [router]
  );

  useEffect(() => {
    if (iaResponse.isSuccess) {
      setMessages((prev) => {
        // Verifica se a resposta já foi adicionada
        const hasRobotResponse = prev.some(
          (msg) => msg.type === "robot" && msg.message === iaResponse.data
        );

        if (hasRobotResponse) return prev;
        interactions.refetch()
        return [
          ...prev,
          {
            type: "robot",
            message: iaResponse.data.message,
          },
        ];
      });
    }
  }, [iaResponse.isSuccess, iaResponse.data]);

  useEffect(() => {
    if (form.current) form.current.reset();
    if (chat.current) {
      const lastChild = chat.current.lastElementChild as HTMLElement | null;
      if (lastChild) {
        chat.current.scrollTo({
          top: lastChild.offsetTop - 40,
          behavior: "smooth"
        });
      } else {
        chat.current.scrollTop = chat.current.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (setShowParent) setShowParent(showChat);
  }, [showChat]);

  return (
    <>
      <div
        className={`fixed left-0 top-0 transition-all duration-500 w-full ${(!showChat) ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} w-full h-full bg-black/70 z-50`}
      />
       <div
          className={`${isAtBottom && !showChat ? "absolute" : "fixed bottom-0 min-h-100"} z-50 left-0 sm:left-1/2 sm:translate-x-[-50%] w-full max-w-[980px] h-[90%] rounded-t-3xl bg-linear-to-b ${(!showChat) ? "from-black/0 to-black/0 pointer-events-none" : "from-black/75 to-black opacity-100 pointer-events-auto"} max-h-fit transition-all duration-500 overflow-hidden`}
        style={{
          boxShadow: showChat ? "rgba(255, 255, 255, 0.2) 0px 20px 80px inset" : "",
        }} >
         <div className="h-full">
           {showChat && <div
            className="cursor-pointer absolute top-5 right-5 w-6 h-6 rounded-full flex items-center justify-center text-sm bg-primary text-black z-20"
            onClick={() => {
              setShowChat(false);
            }}
          >
            x
          </div>}
        <div className="w-full flex h-[80%]">
           <AiMessages messages={messages} showChat={showChat} chat={chat} handleLinkClick={handleLinkClick} iaResponse={iaResponse} />
          <AiInteractions interactions={interactions} showChat={showChat} />
        </div>
          {(isFloat || showChat) && <div className={`px-5 pb-5 absolute bottom-5 left-1/2 translate-x-[-50%] w-full pointer-events-auto transition-all duration-500 ${isFixed || showChat ? "opacity-100" : "opacity-0"}`}>
            <AiChatForm
              placeholder={placeholder}
              form={form}
              setCurrentUserMessage={setCurrentUserMessage}
              setMessages={setMessages}
              theme={theme}
              setShowChat={setShowChat}
            />
          </div>}
         </div>
         
        </div>
        {!isFloat && <div className="w-full max-w-[300px]"><AiChatForm
              placeholder={placeholder}
              form={form}
              setCurrentUserMessage={setCurrentUserMessage}
              setMessages={setMessages}
              theme={theme}
              setShowChat={setShowChat}
            /></div>}
    </>
  );
};
