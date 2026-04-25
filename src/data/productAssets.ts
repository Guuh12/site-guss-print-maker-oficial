/**
 * Carrega todas as imagens de `src/assets/produtos` no build (Vite).
 * Nos produtos, use só o caminho relativo depois de `produtos/`, com "/".
 *
 * Ex.: productImageUrl("Bonecos/papaguio-mine1.jpg")
 *
 * Observação: qualquer arquivo que combine com o glob abaixo entra no bundle,
 * mesmo sem aparecer em `products`. Mantenha nessa pasta só fotos do catálogo.
 */
const eagerImages = import.meta.glob<{ default: string }>(
  "../assets/produtos/**/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

const urlByRelativePath = new Map<string, string>();

for (const [filePath, mod] of Object.entries(eagerImages)) {
  const normalized = filePath.replace(/\\/g, "/");
  const marker = "/produtos/";
  const i = normalized.indexOf(marker);
  if (i === -1) continue;
  const relative = normalized.slice(i + marker.length);
  urlByRelativePath.set(relative, mod.default);
}

/** Caminho após `src/assets/produtos/`. Ex.: "Cuidados Pessoais/porta-cotonete1.jpg" */
export function productImageUrl(relativeToProdutos: string): string {
  const key = relativeToProdutos.replace(/\\/g, "/").replace(/^\//, "");
  const url = urlByRelativePath.get(key);
  if (!url) {
    const available = [...urlByRelativePath.keys()].sort().join(", ");
    throw new Error(`Imagem não encontrada: produtos/${key}. Registradas: ${available}`);
  }
  return url;
}
