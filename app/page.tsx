"use client"
import { useGetOpenAPI } from "@/src/hooks/getOpenAi";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState<{type:string, message: string}[]>([])
  const [currentUserMessage, setCurrentUserMessage] = useState('')
  const form = useRef<HTMLFormElement>(null)
  const iaResponse = useGetOpenAPI(currentUserMessage)



    // Efeito para adicionar a resposta quando estiver pronta
  useEffect(() => {
    if (iaResponse.isSuccess) {
      setMessages((prev) => {
        // Verifica se a resposta já foi adicionada
        const hasRobotResponse = prev.some(msg => 
          msg.type === "robot" && msg.message === iaResponse.data
        );
        
        if (hasRobotResponse) return prev;
        
        return [...prev, {
          type: "robot",
          message: iaResponse.data.message
        }]
      });

    }
  }, [iaResponse.isSuccess, iaResponse.data]);

  useEffect(() =>{
    if(form.current) form.current.reset()
  },[messages])

  return (
    <div className="flex flex-col justify-between items-center
     h-full p-10">
      <div>
        {/* Marca */}
      </div>
      <div className="p-20 rounded-3xl">
        {messages.map((item, index) => {
          return (
            <div className="mb-3" key={index}>
              <Markdown>{item.message}</Markdown>
            </div>
          )
        })}
        {iaResponse.isFetching && <div>Digitando ...</div>}
      </div>  
      <form ref={form} className="flex gap-2 w-full justify-center" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem("message") as HTMLInputElement;
        setCurrentUserMessage(input.value)
        setMessages((prev) => {
          return [...prev, {
            type: "user",
            message: input.value
          }]
        })
        
        
      }}>
        <div className="basis-1/2 flex gap-10">
          <input name="message" className="bg-gray-500 text-white py-2 px-3 rounded-lg flex-1 outline-none" type="text" />
          <button className="cursor-pointer bg-gray-300 text-black px-5 rounded-2xl">Enviar</button>
        </div>
      </form>
    </div>
  );
}
