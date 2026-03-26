const PROXY_PREFIXES = ['/api/', '/uploads/', '/healthcheck']

export default {
  fetch(request, env) {
    const url = new URL(request.url)
    const apiUrl = env.API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001'

    const shouldProxy = PROXY_PREFIXES.some((prefix) =>
      url.pathname.startsWith(prefix),
    )

    if (shouldProxy) {
      const target = new URL(url.pathname + url.search, apiUrl)
      return fetch(
        new Request(target.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.body,
          redirect: 'follow',
        }),
      )
    }

    // All other paths: fall through to static assets (SPA)
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>