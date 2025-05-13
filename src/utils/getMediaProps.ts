
export type MediaItem = string | {
  src: string;
  poster?: string;
};

export function getMediaProps(media: MediaItem) {
  if (typeof media === 'string') return { src: media };
  return media;
}
