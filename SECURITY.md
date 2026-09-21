# SECURITY

Detta dokument beskriver vilka säkerhetsåtgärder som finns i UppMAKE-sajten och vad som gäller i drift.

## Om lösningen

- Sajten är statisk (HTML/CSS/JS).
- Ingen server-side applikationslogik, ingen databas, ingen inloggning.
- Ingen hantering av personuppgifter i backend via denna kodbas.

## Implementerade skydd

### 1. Strikt Content Security Policy (CSP)

CSP används för att begränsa vad sidan får ladda.

Aktiv policy i `index.html` och `.htaccess`:

- `default-src 'self'`
- `script-src 'self'`
- `style-src 'self'`
- `font-src 'self'`
- `img-src 'self' data:`
- `media-src 'self'`
- `connect-src 'self'`
- `frame-src 'self' https://www.google.com https://maps.google.com`
- `object-src 'none'`
- `base-uri 'self'`
- `frame-ancestors 'self'` (HTTP-header only; a meta tag ignores this directive and logs a console error)
- `form-action 'self'`
- `upgrade-insecure-requests`

Detta minskar risken för XSS, injicerade tredjepartsskript och osäkra inbäddningar.

### 2. Säkerhetsheaders i produktion (`.htaccess`)

Följande headers är konfigurerade:

- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (begränsar känsliga browser-API:er)
- `X-Permitted-Cross-Domain-Policies: none`

### 3. Endast nödvändig extern inbäddning

- Google Maps används via `iframe` för kartvisning.
- Ingen extern JavaScript-kod laddas.
- Externa länkar använder `rel="noopener noreferrer"` där relevant.

### 4. Minimerad attackyta

- Inga paketmanager-beroenden krävs för runtime av sajten.
- Ingen automatisk hämtning av kod från tredjepartstjänster.
- Ingen analytics/pixel-tracking i nuvarande implementation.

## Viktig driftnotering

GitHub Pages tillämpar inte `.htaccess`. Därför är säkerhetsheaders från `.htaccess` främst relevanta i produktionsdrift på Apache/Loopia.

För Loopia/Apache gäller:

- HTTPS-redirect är aktiverad.
- `.htaccess`-headers ska ligga kvar aktiva.

## Kvarstående risker och rekommendationer

- Embed-innehåll (Google Maps) är tredjepartsinnehåll och följer Googles policies.
- Om nya externa integrationer läggs till ska CSP uppdateras explicit.
- Kör gärna regelbundna kontroller med t.ex. Mozilla Observatory eller SecurityHeaders.

## Sårbarhetsrapportering

Vid säkerhetsfrågor eller rapport av sårbarhet:

- Kontakt: `kontakt@uppmake.se`
