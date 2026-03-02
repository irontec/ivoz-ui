export function parseContentDispositionFilename(
  contentDisposition: string
): string {
  const filenameStar = contentDisposition.match(
    /filename\*\s*=\s*([^']*)'([^']*)'((?:%[0-9A-Fa-f]{2}|[!#$&+\-.^_`|~\w])+)/i
  );
  if (filenameStar) {
    return decodeURIComponent(filenameStar[3]);
  }

  const filename = contentDisposition.match(
    /filename\s*=\s*(?:"([^"]*)"|([^;\s]+))/i
  );
  if (filename) {
    return filename[1] ?? filename[2];
  }

  return 'download';
}
