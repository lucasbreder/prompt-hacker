import { SerializedEditorState, SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";
import { Image } from "./Image";
import { GalleryPropsItem } from "./Gallery";
import { NavItem } from "./Nav";
import { ApiResponse } from "./ApiResponse";

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
  nav?: ApiResponse<NavItem>;
  art?: Image;
  author?: string;
  gallery?: GalleryPropsItem[];
  team?: string;
  showNav?: boolean;
}

export interface ArtProps {
  id: number;
  title: string;
  slug: string;
  description: SerializedEditorState<SerializedLexicalNode>;
  excerpt: string;
  art?: Image;
  author?: string;
  team?: string;
  year?: number;
  platform?: string[];
  axis?: string[];
  art_video?: Image;
  art_process?: Image[];
  process_layout?: 'grid' | 'vertical' | 'carousel';
  thumbnail?: Image;
  author_note?: string;
}

export interface ArtData {
  id: number;
  title: string;
  slug: string;
  author?: string;
  content: string;
  excerpt: string;
  art?: Image;
  nav?: ApiResponse<NavItem>;
  thumbnail?: Image;
  gallery?: GalleryPropsItem[];
  team?: string;
  showNav?: boolean;
  year?: number;
  platform?: string[];
  axis?: string[];
  art_video?: Image;
  art_process?: Image[];
  process_layout?: 'grid' | 'vertical' | 'carousel';
  author_note?: string;
}
