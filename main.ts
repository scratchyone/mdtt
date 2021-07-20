import 'ts-replace-all';

export function cleanMarkdown(md: string): string {
  return md
    .replaceAll('#', '\\#')
    .replaceAll('*', '\\*')
    .replaceAll('_', '\\_')
    .replaceAll('~', '\\~')
    .replaceAll('>', '\\>')
    .replaceAll('+', '\\+')
    .replaceAll('`', '\\`')
    .replaceAll('|', '\\|')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replaceAll('-', '\\-')
    .replaceAll('. ', '\\. ')
    .replaceAll('!', '\\!');
}
export function stringifyValue(value: any, safeStrings: string[]): string {
  if (Array.isArray(value)) {
    return value.map((v) => stringifyValue(v, safeStrings)).join('');
  } else if (value === null || value === undefined) {
    return '';
  } else if (safeStrings.includes(value.toString())) {
    return value.toString();
  } else {
    return cleanMarkdown(value.toString());
  }
}
function realM(
  safeStrings: string[],
  strings: TemplateStringsArray,
  values: any[]
) {
  let result = '';
  strings.forEach((str, i) => {
    result += str;
    if (values.length > i) {
      result += stringifyValue(values[i], safeStrings);
    }
  });
  safeStrings.push(result.toString());
  return result;
}
export default function createM(): (
  // eslint-disable-next-line no-unused-vars
  strings: TemplateStringsArray,
  // eslint-disable-next-line no-unused-vars
  ...values: any[]
) => string {
  const safeStrings: string[] = [];
  return (strings, ...values) => realM(safeStrings, strings, values || []);
}
