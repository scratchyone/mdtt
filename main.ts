import 'core-js/features/string/replace-all';

interface Options {
  sanitizeHtml: boolean;
}

export function cleanMarkdown(md: string, options: Options): string {
  let newMd = md
    .replaceAll('#', '\\#')
    .replaceAll('*', '\\*')
    .replaceAll('_', '\\_')
    .replaceAll('~', '\\~')
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
  if (options.sanitizeHtml)
    newMd = newMd
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  else newMd = newMd.replaceAll('>', '\\>');
  return newMd;
}
export function stringifyValue(
  value: any,
  safeStrings: string[],
  options: Options
): string {
  if (Array.isArray(value)) {
    return value.map((v) => stringifyValue(v, safeStrings, options)).join('');
  } else if (value === null || value === undefined) {
    return '';
  } else if (safeStrings.includes(value.toString())) {
    return value.toString();
  } else {
    return cleanMarkdown(value.toString(), options);
  }
}
function realM(
  safeStrings: string[],
  strings: TemplateStringsArray,
  values: any[],
  options: Options
) {
  let result = '';
  strings.forEach((str, i) => {
    result += str;
    if (values.length > i) {
      result += stringifyValue(values[i], safeStrings, options);
    }
  });
  safeStrings.push(result.toString());
  return result;
}
export default function createM(
  options: Options | undefined
): (
  // eslint-disable-next-line no-unused-vars
  strings: TemplateStringsArray,
  // eslint-disable-next-line no-unused-vars
  ...values: any[]
) => string {
  const safeStrings: string[] = [];
  return (strings, ...values) =>
    realM(
      safeStrings,
      strings,
      values || [],
      options || { sanitizeHtml: false }
    );
}
