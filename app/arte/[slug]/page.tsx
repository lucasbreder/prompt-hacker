import { Footer } from "@/src/components/Footer";
import { Page } from "@/src/components/Page";
import { ApiResponse } from "@/src/types/ApiResponse";
import { ArtProps } from "@/src/types/Page";
import { fetchAPI } from "@/src/utils/util.fetch.api";
import { converterHTML } from "@/src/utils/util.lexical.converter";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { NavItem } from "@/src/types/Nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Prompter Hacker',
};


export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const pageContent: ApiResponse<ArtProps> = await fetchAPI({
    url: `/art?where[slug][equals]=${slug}`,
    method: "GET",
  });

    const nav: ApiResponse<NavItem> = await fetchAPI({
      url: "/nav?where[type][equals]=principal&sort=id",
      method: "GET",
    });

  if (pageContent && pageContent.docs.length > 0) {
    const html = await convertLexicalToHTML({
      data: pageContent.docs[0].description,
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
          art={pageContent.docs[0]?.art}
          team={pageContent.docs[0]?.team}
          author={pageContent.docs[0]?.author}
          nav={nav}
          showNav={true}
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
