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

export const AiChat = ({
  theme = "dark",
  placeholder = "Seja Guiado",
  setShowParent,
}: {
  theme?: "dark" | "light";
  placeholder?: string;
  setShowParent?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [messages, setMessages] = useState<{ type: string; message: string }[]>(
    []
  );
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const form2 = useRef<HTMLFormElement>(null);
  const chat = useRef<HTMLDivElement>(null);
  const iaResponse = useGetOpenAPI(currentUserMessage);
  const router = useRouter();

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
    if (form2.current) form2.current.reset();
    if (chat.current) chat.current.scrollTop = chat.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (setShowParent) setShowParent(showChat);
  }, [showChat]);

  return (
    <>
      <div
        className={`fixed left-0 transition-all duration-500 ${!showChat ? "-top-[200%]" : "top-0"} w-full h-full bg-white/70 z-50`}
      >
        <div
          className={`relative w-[calc(100%-30px)] rounded-3xl  bg-black text-white m-4 h-[calc(100%-80px)]`}
        >
          <div
            className="absolute top-5 right-5 w-6 h-6 border rounded-full flex items-center justify-center text-sm"
            onClick={() => {
              setShowChat(false);
            }}
          >
            x
          </div>
          <div
            ref={chat}
            className="max-h-[calc(100%-90px)] overflow-auto p-10"
          >
            <AnimatePresence>
              {messages.map((item, index) => {
                return (
                  <motion.div
                    onClick={handleLinkClick}
                    initial={{ opacity: 0, left: -10 }}
                    transition={{ duration: 0.5 }}
                    animate={{ opacity: 1, left: 0 }}
                    exit={{ opacity: 0, left: -10 }}
                    className={`chat ${item.type === "user" ? "text-secondary" : "text-white"} mb-3 relative`}
                    key={index}
                  >
                    <Markdown>{item.message}</Markdown>
                  </motion.div>
                );
              })}
              {iaResponse.isFetching && (
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, left: -10 }}
                  animate={{ opacity: 1, left: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Digitando ...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute bottom-5 left-5 w-[calc(100%-40px)]">
            <AiChatForm
              placeholder={placeholder}
              form={form}
              setCurrentUserMessage={setCurrentUserMessage}
              setMessages={setMessages}
              theme={theme}
              setShowChat={setShowChat}
            />
          </div>
        </div>
      </div>
      <AiChatForm
        placeholder={placeholder}
        form={form2}
        setCurrentUserMessage={setCurrentUserMessage}
        setMessages={setMessages}
        theme={theme}
        setShowChat={setShowChat}
      />
    </>
  );
};
