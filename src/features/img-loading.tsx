export const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?w=${width}`;
};
