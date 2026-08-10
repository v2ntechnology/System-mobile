import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Chip } from "@/components/ui/chip";
import { GlassCard } from "@/components/ui/glass-card";
import { fetchPosts } from "@/features/blog/api";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Custo por km, checklist, manutenção preventiva e privacidade de telemetria — o que aprendemos operando frota junto com nossos clientes.",
};

export default async function BlogPage() {
  const posts = await fetchPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="pb-12 pt-12 sm:pb-16 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow="Blog"
            title="O que a operação ensina antes do software"
            description="Textos escritos por quem senta com gestor de frota toda semana. Sem lista de dez dicas."
          />
        </Container>
      </section>

      <Section className="pt-0">
        {featured ? (
          <GlassCard className="reveal mb-4 flex flex-col gap-4 p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Chip>{featured.category}</Chip>
              <span className="text-label-md text-on-surface-muted">
                <time dateTime={featured.publishedAt}>{formatLongDate(featured.publishedAt)}</time>
                {" · "}
                <span className="tabular">{featured.readingMinutes}</span> min de leitura
              </span>
            </div>

            <h2 className="font-display text-headline-lg text-on-surface sm:text-display-lg text-balance">
              <Link href={`/blog/${featured.slug}`} className="hover:text-secondary">
                {featured.title}
              </Link>
            </h2>

            <p className="text-body-lg text-on-surface-variant max-w-2xl text-pretty">
              {featured.excerpt}
            </p>

            <Link
              href={`/blog/${featured.slug}`}
              className="text-body-md text-secondary inline-flex items-center gap-2 hover:underline"
            >
              Ler o artigo
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </GlassCard>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          {rest.map((post) => (
            <GlassCard key={post.slug} className="reveal flex flex-col gap-3 p-6">
              <Chip className="self-start">{post.category}</Chip>

              <h2 className="font-display text-headline-md text-on-surface">
                <Link href={`/blog/${post.slug}`} className="hover:text-secondary">
                  {post.title}
                </Link>
              </h2>

              <p className="text-body-md text-on-surface-variant flex-1">{post.excerpt}</p>

              <p className="text-label-md text-on-surface-muted">
                <time dateTime={post.publishedAt}>{formatLongDate(post.publishedAt)}</time>
                {" · "}
                <span className="tabular">{post.readingMinutes}</span> min
              </p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <CtaSection
        title="Prefere ver na prática?"
        description="A demonstração usa os mesmos números destes textos — só que com a sua frota dentro."
      />
    </>
  );
}
