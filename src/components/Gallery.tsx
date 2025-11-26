import { GalleryPropsItem } from "../types/Gallery";
import { GalleryItem } from "./GalleryItem";

export const Gallery = ({ data }: { data: GalleryPropsItem[] }) => {
  return (
    <section>
      {data.map((item, index) => {
        return <GalleryItem key={index} {...item} />;
      })}
    </section>
  );
};
