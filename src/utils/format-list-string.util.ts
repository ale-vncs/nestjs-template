export function formatListString(
  list: string[],
  type: Intl.ListFormatType = 'conjunction',
) {
  return new Intl.ListFormat('pt-BR', {
    style: 'long',
    type,
  }).format(list);
}
