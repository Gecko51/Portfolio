// Portrait — photo de Guillaume Gay dans la grille About (colonne de droite).
// Server component : next/image en mode `fill` dans un conteneur aspect-[4/5] → CLS=0.
// object-cover recadre légèrement la photo (1000x1295, ratio ~0.77) sur le ratio 4:5 du conteneur.
import Image from 'next/image';

type PortraitProps = {
  alt: string;
};

export function Portrait({ alt }: PortraitProps) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded">
      <Image
        src="/images/portrait-guillaume.jpg"
        alt={alt}
        fill
        // unoptimized : image déjà pré-redimensionnée/compressée (1000x1295, 117 Ko) ;
        // cohérent avec les autres images du projet (covers) et neutre vis-à-vis de l'optimiseur Netlify.
        unoptimized
        // object-center : sujet centré dans le cadre, recadrage symétrique haut/bas négligeable.
        className="object-cover object-center"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={false}
      />
    </div>
  );
}
