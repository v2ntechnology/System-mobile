import { ArrowLeft } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Chip } from "@/components/ui/chip";
import { fetchPost, listPostSlugs, type Post, type PostBlock } from "@/features/blog/api";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { formatLongDate } from "@/lib/format";

interface PageProps {
  /** Next 15 — `params` chega como Promise. */
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

async function loadPost(slug: string): Promise<Post> {
  try {
    return await fetchPost(slug);
  } catch {
    // O mock lança `ApiError(404)`; a API real vai lançar o mesmo. Slug inválido é
    // 404 de verdade, não erro de servidor.
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.kind) {
    case "heading":
      return <h2 className="font-display text-headline-md text-on-surface mt-10">{block.text}</h2>;
    case "list":
      return (
        <ul className="mt-6 flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="text-body-lg text-on-surface-variant flex gap-3">
              <span
                aria-hidden="true"
                className="rounded-pill bg-secondary mt-3 h-1.5 w-1.5 shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-primary text-body-lg text-on-surface mt-8 text-pretty border-l-2 pl-6">
          {block.text}
          {block.attribution ? (
            <footer className="text-label-md text-on-surface-muted mt-2">
              {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );
    case "paragraph":
      return <p className="text-body-lg text-on-surface-variant mt-6 text-pretty">{block.text}</p>;
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  return (
    <>
      <article className="pb-8 pt-12 sm:pt-20">
        <Container narrow>
          <Link
            href="/blog"
            className="text-body-md text-on-surface-variant hover:text-on-surface inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            Todos os artigos
          </Link>

          <header className="mt-8 flex flex-col gap-4">
            <Chip className="self-start">{post.category}</Chip>

            <h1 className="font-display text-headline-lg text-on-surface sm:text-display-lg text-balance">
              {post.title}
            </h1>

            <p className="text-body-lg text-on-surface-variant text-pretty">{post.excerpt}</p>

            <p className="border-outline-variant text-label-md text-on-surface-muted border-t pt-4">
              {post.author.name} · {post.author.role} ·{" "}
              <time dateTime={post.publishedAt}>{formatLongDate(post.publishedAt)}</time> ·{" "}
              <span className="tabular">{post.readingMinutes}</span> min de leitura
            </p>
          </header>

          <div className="mt-4">
            {post.body.map((block, index) => (
              // Bloco de conteúdo não tem id próprio e a ordem é estável (vem do CMS
              // como lista), então o índice é chave legítima aqui.
              <Block key={index} block={block} />
            ))}
          </div>
        </Container>
      </article>

      <CtaSection />
    </>
  );
}
