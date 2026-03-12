import { AnimatePresence } from "motion/react"
import { motion } from "motion/react"
import Markdown from "react-markdown"

export const AiMessages = ({messages, showChat, chat, handleLinkClick, iaResponse}: {messages: {type: string, message: string}[], showChat: boolean, chat: React.RefObject<HTMLDivElement | null>, handleLinkClick: (event: any) => void, iaResponse: any}) => {
    return (
        <div
            ref={chat}
            className={`${showChat ? "opacity-100 h-[calc(100%-20px)] overflow-auto px-4 pt-20" : "opacity-0 h-0 overflow-hidden"} relative basis-full sm:basis-9/12 overflow-auto rounded-3xl scrollbar-width-6`}
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
                    className={`sm:max-w-8/12 w-fit chat rounded-t-2xl ${item.type !== "robot" ? "bg-white text-black rounded-r-2xl py-1 px-4" : "rounded-l-2xl text-white"} mb-3 relative`}
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
    )
}