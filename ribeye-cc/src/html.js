/** Escape text and attribute values before inserting shared data into HTML. */
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export function link(href, label, attributes = '') {
  const url = new URL(href, 'https://ribeye.cc');
  if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) throw new Error(`Unsupported link: ${href}`);
  return `<a href="${escapeHtml(href)}"${attributes ? ` ${attributes}` : ''}>${escapeHtml(label)}</a>`;
}
