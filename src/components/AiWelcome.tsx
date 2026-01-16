"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetOpenAPI } from "@/src/hooks/getOpenAi";
import Markdown from "react-markdown";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export const AiWelcome = ({ message }: { message?: string }) => {
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [messages, setMessages] = useState<{ type: string; message: string }[]>(
    []
  );
  const iaResponse = useGetOpenAPI(currentUserMessage);
  const router = useRouter();
  const messagesContainer = useRef(null);

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
        }
      }
    },
    [router]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Quando o elemento cruza o limite (threshold), atualiza o estado
      if (message) setCurrentUserMessage(message);
    });

    const currentRef = messagesContainer.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Limpeza: Desconecta o observer quando o componente é desmontado ou o ref muda
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

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

  return (
    <AnimatePresence>
      <div ref={messagesContainer}>
        {currentUserMessage && (
          <div className="chat-light mb-5 border border-gray-400 pb-5 rounded-2xl p-7 relative">
            <div className="absolute bg-white left-5 -top-3 px-2">Guia</div>
            {messages.map((item, index) => {
              return (
                <motion.div
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, left: -10 }}
                  transition={{ duration: 0.5 }}
                  animate={{ opacity: 1, left: 0 }}
                  exit={{ opacity: 0, left: -10 }}
                  className={`text-gray-500`}
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
                <span className="loader black"></span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
