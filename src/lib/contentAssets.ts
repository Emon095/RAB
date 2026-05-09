const contentAssetModules = import.meta.glob('/src/content/**/*.{png,jpg,jpeg,gif,webp,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const contentAssets = new Map<string, string>();

const normalizeKey = (value: string) => {
  const parts: string[] = [];

  value
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .split('/')
    .forEach((part) => {
      if (!part || part === '.') return;
      if (part === '..') {
        parts.pop();
        return;
      }
      parts.push(part);
    });

  return parts.join('/');
};

const stripContentPrefix = (value: string) => normalizeKey(value).replace(/^(src\/content\/|content\/)/, '');

const basename = (value: string) => {
  const parts = normalizeKey(value).split('/');
  return parts[parts.length - 1];
};

Object.entries(contentAssetModules).forEach(([path, url]) => {
  const contentPath = stripContentPrefix(path.replace(/^\/src\/content\//, ''));
  const keys = new Set([
    contentPath,
    basename(contentPath),
    `attachments/${basename(contentPath)}`,
    `Attachments/${basename(contentPath)}`,
  ]);

  keys.forEach((key) => {
    contentAssets.set(key, url as string);
    contentAssets.set(key.toLowerCase(), url as string);
  });
});

const isDirectUrl = (value: string) => /^(https?:|data:|blob:|\/)/i.test(value);

const unwrapObsidianLink = (value: string) => {
  const trimmed = value.trim();
  const match = trimmed.match(/^!?\[\[([^\]]+)\]\]$/);
  if (!match) return trimmed;

  return match[1].split('|')[0].split('#')[0].trim();
};

export const resolveContentAsset = (value?: string) => {
  if (!value) return '';

  const source = unwrapObsidianLink(value.replace(/^["']|["']$/g, ''));
  if (!source || isDirectUrl(source)) return source;

  const key = stripContentPrefix(source);
  const candidates = [
    key,
    key.replace(/^(\.\.\/)+/, ''),
    key.replace(/^(\.\.\/)+/, 'attachments/'),
    basename(key),
    `attachments/${basename(key)}`,
  ];

  for (const candidate of candidates) {
    const resolved = contentAssets.get(candidate) || contentAssets.get(candidate.toLowerCase());
    if (resolved) return resolved;
  }

  return source;
};

export const parseContentImageList = (value?: string | string[]) => {
  const items = Array.isArray(value)
    ? value
    : String(value || '')
      .split(/[\n,]/)
      .map((item) => item.trim());

  return items.filter(Boolean).map(resolveContentAsset);
};

export const renderObsidianEmbeds = (content: string) => {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (_, link: string) => {
    const [target, label] = link.split('|');
    const src = resolveContentAsset(target);
    const alt = (label || basename(target)).trim();
    return `![${alt}](${src})`;
  });
};
