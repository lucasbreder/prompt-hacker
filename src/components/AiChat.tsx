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
  placeholder = "Alguma pergunta?",
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
        className={`fixed left-0 top-0 transition-all duration-500 ${!showChat ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} w-full h-full bg-black/70 z-50`}
      >
        <div
          className={`absolute left-0 sm:left-1/2 sm:translate-x-[-50%] ${!showChat ? "bottom-[-200%]" : "bottom-0"} w-full max-w-[980px] h-full rounded-t-3xl bg-gradient-to-b from-black/75 to-black text-white min-h-100 max-h-fit pb-25`}
        style={{
          boxShadow: "rgba(255, 255, 255, 0.2) 0px 20px 80px inset",
        }} >
          <div
            className="absolute top-5 right-5 w-6 h-6 border rounded-full flex items-center justify-center text-sm z-20"
            onClick={() => {
              setShowChat(false);
            }}
          >
            x
          </div>
          <div
            ref={chat}
            className="max-h-[95%] overflow-auto px-4 pt-15 sm:flex sm:flex-col"
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
                    className={`sm:max-w-8/12 w-fit chat rounded-t-2xl py-1 px-4 text-black ${item.type !== "robot" ? "bg-white rounded-r-2xl" : "bg-primary rounded-l-2xl"} mb-3 relative`}
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
                  <span className="loader"></span>
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
