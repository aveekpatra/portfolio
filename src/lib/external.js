// Links to other sites open in a new tab; links within this site do not.
export function external(href) {
  return /^https?:\/\//.test(href ?? '')
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
}
