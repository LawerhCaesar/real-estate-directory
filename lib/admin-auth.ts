export type AdminIdentity = {
  authenticated: boolean;
  authorized: boolean;
  email: string | null;
};

export function getAdminIdentity(requestHeaders: Headers): AdminIdentity {
  const userId = requestHeaders.get('oai-authenticated-user-id');
  const email = requestHeaders.get('oai-authenticated-user-email')?.trim().toLowerCase() ?? null;
  const configuredAdmins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const authenticated = Boolean(userId || email);
  const localSitesUser = process.env.NODE_ENV !== 'production' && email === 'seedy@sites.test';

  return {
    authenticated,
    authorized: Boolean(authenticated && email && (localSitesUser || configuredAdmins.includes(email))),
    email,
  };
}
