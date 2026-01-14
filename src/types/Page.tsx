import { SerializedEditorState, SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";
import { Image } from "./Image";
import { GalleryPropsItem } from "./Gallery";

export interface PageProps {
  id: number;
  title: string;
  slug: string;
  content: SerializedEditorState<SerializedLexicalNode>;
  excerpt: string;
  thumbnail?: Image;
}

export interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail?: string;
  art?: Image;
  gallery?: GalleryPropsItem[];
  team?: string;
}

export interface ArtProps {
  id: number;
  title: string;
  slug: string;
  description: SerializedEditorState<SerializedLexicalNode>;
  excerpt: string;
  art?: Image;
  team?: string;
}

export interface ArtData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  art?: Image;
  thumbnail?: string;
  gallery?: GalleryPropsItem[];
  team?: string;
}
