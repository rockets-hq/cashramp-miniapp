import * as Sentry from "@sentry/vue";

const EMAIL = /[\w.+%-]+(?:@|%40)[\w-]+(?:\.[\w-]+)+/gi;
const PHONE = /(^|[^\w-])((?:\+|%2B)?\d[\d\s-]{7,}\d)(?![\w:-])/gi;
const PHONE_MIN_DIGITS = 10;
const SAFE_HEADERS = new Set(["accept", "accept-language", "content-type", "referer", "user-agent"]);

const IGNORE_ERRORS = [
  "ResizeObserver loop",
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i,
  /AbortError|signal is aborted|The (?:user|operation) aborted/i,
  /^(?:TypeError: )?(?:Failed to fetch|Load failed|NetworkError when attempting to fetch resource\.?)$/,
];

const DENY_URLS = [/^(?:chrome|moz|safari|safari-web)-extension:\/\//];

export const maskPii = (value) =>
  value
    .replace(EMAIL, "[email]")
    .replace(PHONE, (match, prefix, number) => (number.replace(/\D/g, "").length >= PHONE_MIN_DIGITS ? `${prefix}[phone]` : match));

const maskDeep = (value) => {
  if (typeof value === "string") return maskPii(value);
  if (Array.isArray(value)) return value.map(maskDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, maskDeep(inner)]));
  }
  return value;
};

const scrubBreadcrumb = (breadcrumb) => ({
  ...breadcrumb,
  message: breadcrumb.message && maskPii(breadcrumb.message),
  data: breadcrumb.data && maskDeep(breadcrumb.data),
});

export const scrubEvent = (event) => {
  if (event.message) event.message = maskPii(event.message);
  if (event.transaction) event.transaction = maskPii(event.transaction);
  for (const exception of event.exception?.values ?? []) {
    if (exception.value) exception.value = maskPii(exception.value);
  }

  if (event.request) {
    const { method, url, query_string, headers } = event.request;
    event.request = {
      method,
      url: url && maskPii(url),
      query_string: query_string && maskDeep(query_string),
      headers:
        headers &&
        Object.fromEntries(
          Object.entries(headers)
            .filter(([name]) => SAFE_HEADERS.has(name.toLowerCase()))
            .map(([name, value]) => [name, maskPii(value)]),
        ),
    };
  }

  event.breadcrumbs = event.breadcrumbs?.map(scrubBreadcrumb);
  event.user = event.user?.id ? { id: event.user.id } : undefined;
  return event;
};

export const initErrorReporting = (app) => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    app,
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    ignoreErrors: IGNORE_ERRORS,
    denyUrls: DENY_URLS,
    beforeSend: scrubEvent,
  });
};
