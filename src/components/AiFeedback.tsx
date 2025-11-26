"use client";
import { useCallback, useEffect, useState } from "react";
import { useGetOpenAPI } from "@/src/hooks/getOpenAi";
import Markdown from "react-markdown";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const AiFeedback = ({ message }: { message?: string }) => {
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [messages, setMessages] = useState<{ type: string; message: string }[]>(
    []
  );
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

  return (
    <>
      <div
        className="flex gap-3 justify-center items-center text-xl"
        onClick={() => {
          message && setCurrentUserMessage(message);
        }}
      >
        <div>[ </div>
        <button className="cursor-pointer">
          <Image src="/icons/ai.png" width={24} height={18} alt="Menu" />
        </button>
        <div>Vamos continuar? ]</div>
      </div>
      <div>
        {currentUserMessage && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, left: -10 }}
              transition={{ duration: 0.5 }}
              animate={{ opacity: 1, left: 0 }}
              exit={{ opacity: 0, left: -10 }}
            >
              <div className="chat mb-5 border border-white pb-5 rounded-2xl p-7 relative mt-10">
                <div className="absolute bg-black left-5 -top-3 px-2">Guia</div>
                {messages.map((item, index) => {
                  return (
                    <motion.div
                      onClick={handleLinkClick}
                      initial={{ opacity: 0, left: -10 }}
                      transition={{ duration: 0.5 }}
                      animate={{ opacity: 1, left: 0 }}
                      exit={{ opacity: 0, left: -10 }}
                      className={`text-white`}
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
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
};
