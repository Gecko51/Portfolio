// STUB Phase 4 Task 10 — sera remplacé en Task 13.
type ProjectGalleryProps = {
  images: readonly string[];
  alt: string;
};

export function ProjectGallery({ images, alt }: ProjectGalleryProps) {
  return <div data-stub={alt}>{images.length} images</div>;
}
