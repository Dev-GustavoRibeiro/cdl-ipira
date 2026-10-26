/**
 * Dados estruturados (schema.org) para o Google, num único <script> com @graph.
 * Título e textos vêm do banco: '<' vira < para nenhum conteúdo fechar o <script> (XSS).
 * Vai depois do conteúdo: o 1º filho de #conteudo recebe o encaixe sob o header (globals.css).
 */
export default function JsonLd({ data }: { data: Record<string, unknown>[] }) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': data }).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
