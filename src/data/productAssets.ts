const eagerImages = import.meta.glob<string>(
  "../assets/produtos/**/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const urlByRelativePath = new Map<string, string>();

for (const [filePath, url] of Object.entries(eagerImages)) {
  const normalized = filePath.replace(/\\/g, "/");
  const marker = "/produtos/";
  const i = normalized.indexOf(marker);
  if (i === -1) continue;
  urlByRelativePath.set(normalized.slice(i + marker.length), url);
}

export function productImageUrl(relativeToProdutos: string): string {
  const key = relativeToProdutos.replace(/\\/g, "/").replace(/^\//, "");
  const url = urlByRelativePath.get(key);
  if (!url) {
    throw new Error(`Imagem não encontrada: produtos/${key}`);
  }
  return url;
}
