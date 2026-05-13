// ProjectGallery — grid d'images additionnelles d'un projet (frontmatter.gallery).
// Pas affichée si gallery est vide (filtré au call site dans la page detail).
import Image from 'next/image';

type ProjectGalleryProps = {
  images: readonly string[];
  // Alt commun à toutes les images (le titre du projet) — chaque image numérotée pour différenciation.
  alt: string;
};

export function ProjectGallery({ images, alt }: ProjectGalleryProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 md:px-12 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((src, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: images are stable content
            key={idx}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={src}
              alt={`${alt} — image ${idx + 1}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
