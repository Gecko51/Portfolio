// Portrait — photo de Guillaume Gay. Placeholder SVG pour Phase 2, vraie photo en Phase 5.
// Server component : next/image avec dimensions explicites pour CLS=0.
// unoptimized=true car Next refuse d'optimiser les SVG par défaut (sécurité).
import Image from 'next/image';

type PortraitProps = {
  alt: string;
};

export function Portrait({ alt }: PortraitProps) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded">
      <Image
        src="/images/portrait-placeholder.svg"
        alt={alt}
        fill
        unoptimized
        className="object-cover"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={false}
      />
    </div>
  );
}
