function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

export function getCSRFToken(): string | null {
  return readCookie('csrf_token');
}

export async function fetchWithCSRF(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers || {});

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      headers.set('x-csrf-token', csrfToken);
    }
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
