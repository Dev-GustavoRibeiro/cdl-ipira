export function getYoutubeId(url: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}

export function getYoutubeThumbnail(videoId: string): string {
  // Usa hqdefault.jpg pois maxresdefault.jpg não existe em todos os vídeos
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}


