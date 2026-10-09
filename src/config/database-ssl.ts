export function getDatabaseSsl(): false | true | { ca: string } {
  if (process.env.DB_SSL !== 'true') {
    return false;
  }

  const certificateAuthority = process.env.DB_SSL_CA
    ?.replace(/\\n/g, '\n')
    .trim();

  return certificateAuthority ? { ca: certificateAuthority } : true;
}
