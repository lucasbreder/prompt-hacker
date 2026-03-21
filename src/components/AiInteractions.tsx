import Image from "next/image";
import { useMemo, useState } from "react";
import { useGetInteractions } from "../hooks/getInteractions";
import { UseQueryResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

export const AiInteractions = ({
  interactions,
  showChat,
}: {
  interactions: UseQueryResult<number, Error>;
  showChat: boolean;
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const totalInteractions = interactions.data ? Number(interactions.data) : 0;
  const iteractionsPerTree = 20;

  return (
    <div
      className={` sm:flex-col gap-5 py-5 sm:pb-10 sm:my-5 px-5 sm:px-10 text-sm ${showChat ? "opacity-100 overflow-hidden h-30 sm:h-auto" : "opacity-0 h-0 overflow-hidden"} relative flex text-center sm:text-left`}
      style={{
        borderLeft: "1px solid transparent",
        borderImage:
          "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent) 1",
      }}
    >
      <div className="block absolute bottom-0 right-5 sm:right-0 cursor-pointer">
        <Image
          src="/icons/info.svg"
          width={20}
          height={20}
          alt=""
          onClick={() => {
            setShowInfo(!showInfo);
          }}
        />
      </div>
      <div
        className={`${showInfo ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} bg-white text-black flex-col justify-center items-center p-4 rounded-2xl fixed bottom-45 text-center gap-3 w-90 z-20 transition-all duration-300 flex`}
      >
        <Image src="/icons/tree.svg" width={30} height={30} alt="" />
        <div className="font-bold">
          Cada interação neste chat ajuda a plantar uma nova árvore.
        </div>
        <div className="font-light">
          Usamos tecnologia com responsabilidade para compensar o impacto da IA.
        </div>
      </div>
      <div className="flex flex-1 sm:flex-0 flex-col items-center">
        <span className="font-light">Interações:</span>
        <div className="relative overflow-hidden h-6 w-full flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={totalInteractions}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="font-bold"
            >
              {totalInteractions}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-1 sm:flex-0 flex-col items-center">
        <div className="font-light">Próxima Árvore:</div>

        <div className="font-bold">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={totalInteractions}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="font-bold"
            >
              {totalInteractions +
                (iteractionsPerTree - (totalInteractions % iteractionsPerTree))}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="w-full bg-gray-800 h-1 overflow-hidden rounded-full">
          <div
            className="bg-primary h-1 font-bold transition-all duration-300"
            style={{
              width: `${(totalInteractions % iteractionsPerTree) * iteractionsPerTree}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="flex flex-1 sm:flex-0 flex-col items-center">
        <div className="font-light">Árvores Plantadas:</div>
        <div className="font-bold">
          {" "}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={totalInteractions}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="font-bold"
            >
              {Math.floor(totalInteractions / iteractionsPerTree)}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
