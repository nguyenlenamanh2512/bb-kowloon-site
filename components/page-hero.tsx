import { SiteHeader } from "@/components/site-header";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="page-hero">
      <SiteHeader overlay />
      <img src={image} alt={imageAlt} className="page-hero__image" />
      <div className="page-hero__veil" />
      <div className="site-shell page-hero__content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
