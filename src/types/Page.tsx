import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { Image } from "./Image";
import { GalleryPropsItem } from "./Gallery";

export interface PageProps {
  id: number;
  title: string;
  slug: string;
  content: SerializedEditorState;
  excerpt: string;
  thumbnail?: Image;
}

export interface PageData {
  id: number;
  title: string;
  slug: string;
  content: SerializedEditorState;
  excerpt: string;
  thumbnail?: string;
  art?: string;
  gallery?: GalleryPropsItem[];
}

export interface ArtProps {
  id: number;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  art?: Image;
}

export interface ArtData {
  id: number;
  title: string;
  slug: string;
  content: SerializedEditorState;
  excerpt: string;
  art?: string;
  thumbnail?: string;
  gallery?: GalleryPropsItem[];
}
