import { Footer } from "@/src/components/Footer";
import { Page } from "@/src/components/Page";
import { ApiResponse } from "@/src/types/ApiResponse";
import { GalleryDataItem, GalleryPropsItem } from "@/src/types/Gallery";
import { PageProps } from "@/src/types/Page";
import { fetchAPI } from "@/src/utils/util.fetch.api";
import { converterHTML } from "@/src/utils/util.lexical.converter";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";


export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const pageContent: ApiResponse<PageProps> = await fetchAPI({
    url: `/page?where[slug][equals]=${slug}`,
    method: "GET",
  });

  let gallery: GalleryPropsItem[] = [];

  if (pageContent.docs[0].slug === "galeria") {
    const galleryContent: ApiResponse<GalleryDataItem> = await fetchAPI({
      url: `/art`,
      method: "GET",
    });
    gallery = galleryContent.docs.map((item) => {
      return {
        art: process.env.NEXT_PUBLIC_CMS_URL + item.art.url,
        title: item.title,
        slug: item.slug,
      };
    });
  }

  if (pageContent && pageContent.docs.length > 0) {

 const html = await convertLexicalToHTML({
    data: pageContent.docs[0].content,
    converters: converterHTML,
  });
    return (
      <>
        <Page
          id={pageContent.docs[0].id}
          content={html}
          excerpt={pageContent.docs[0].excerpt}
          slug={pageContent.docs[0].slug}
          title={pageContent.docs[0].title}
          thumbnail={pageContent.docs[0]?.thumbnail?.url}
          gallery={gallery}
        />
        <Footer
          title={pageContent.docs[0].title}
          excerpt={pageContent.docs[0].excerpt}
        />
      </>
    );
  }
  return <div>Nada encontrado</div>;
}
