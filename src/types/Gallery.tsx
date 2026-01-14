import { Image } from "./Image";

export interface GalleryPropsItem {
  slug: string;
  art: string;
  title: string;
}

export interface GalleryDataItem {
  slug: string;
  art: Image;
  title: string;
}

export interface GalleryImageItem {
  slug: string;
  art: string;
  title: string;
}

