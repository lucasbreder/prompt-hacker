import { AiFeedback } from "./AiFeedback";

export const Footer = ({
  title,
  excerpt,
}: {
  title: string;
  excerpt: string;
}) => {
  return (
    <footer className="bg-black p-10 bg-[url('/footer.png')] pt-80 pb-30 bg-contain text-tertiary bg-no-repeat">
      <AiFeedback
        message={`Me sugira um novo conteúdo baseado nesse conteúdo: ${title} - ${excerpt}`}
      />
    </footer>
  );
};
