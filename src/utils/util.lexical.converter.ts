import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { HTMLConverters } from "@payloadcms/richtext-lexical/html";

export const converterHTML = ({ defaultConverters }:{defaultConverters: HTMLConverters<DefaultNodeTypes>}) => {
      return {
        ...defaultConverters,
        upload: ({ node }:any) => {
          
          const uploadDoc:any = node.value;
          const caption = node.value.caption;

          if (!uploadDoc || !uploadDoc.url) return '';

          return `
            <figure>
              <img 
                src="${uploadDoc.url}" 
                alt="${uploadDoc.alt || caption || ''}" 
                width="${uploadDoc.width}" 
                height="${uploadDoc.height}" 
              />
              ${
                caption 
                  ? `<figcaption>${caption}</figcaption>` 
                  : ''
              }
            </figure>
          `;
        },
      }
    }