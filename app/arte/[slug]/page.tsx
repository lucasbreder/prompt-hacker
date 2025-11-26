import { Footer } from "@/src/components/Footer";
import { Page } from "@/src/components/Page";
import { ApiResponse } from "@/src/types/ApiResponse";
import { ArtData, ArtProps } from "@/src/types/Page";
import { fetchAPI } from "@/src/utils/util.fetch.api";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const pageContent: ApiResponse<ArtProps> = await fetchAPI({
    url: `/art?where[slug][equals]=${slug}`,
    method: "GET",
  });

  if (pageContent && pageContent.docs.length > 0) {
    return (
      <>
        <Page
          id={pageContent.docs[0].id}
          content={pageContent.docs[0].description}
          excerpt={pageContent.docs[0].excerpt}
          slug={pageContent.docs[0].slug}
          title={pageContent.docs[0].title}
          art={pageContent.docs[0]?.art?.url}
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
