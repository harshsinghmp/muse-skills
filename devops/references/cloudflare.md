# cloudflare — Cloudflare: Workers, Pages, DNS, WAF rules, SSL/TLS, caching, and Zero Trust tunnels.

Consolidates all Cloudflare edge infrastructure and devops-engineer edge routing capabilities.

## Intake

- Target domain and Cloudflare zone ID / account context
- Service type: Workers (serverless edge API/compute), Pages (static/full-stack JAMstack), DNS/WAF, or Tunnel
- SSL/TLS mode requirements (Mandate: Full Strict with valid origin cert)
- Caching requirements (static assets, HTML bypass, Edge Cache TTL)
- Security profile (WAF rules, Bot Fight mode, rate limiting, Turnstile keys)
- Default stack: Wrangler CLI (`wrangler.toml`), Cloudflare Dashboard API, `cloudflared` for Zero Trust tunnels.

## Deliverable

A production-hardened Cloudflare configuration:
1. **Wrangler Manifest / Config**: `wrangler.toml` with environment bindings (KV, D1, R2, Queues, Vectorize).
2. **DNS & Edge Routing**: Declarative records, proxy status (Orange Cloud vs. Grey Cloud), apex CNAME flattening.
3. **Security & WAF Rules**: Rate limiting, country blocks, challenge rules for suspicious ASN/user-agents, Turnstile integration.
4. **Caching & Page Rules**: Cache-everything for hashed static assets, bypass on cookie/Authorization headers.
5. **Zero Trust & Quick Tunnels (`cloudflared`)**: Configuration for both ad-hoc preview ingress (`try.cloudflare.com`) and permanent homelab/staging Zero Trust tunnels without open router ports.

## Procedure

### 1. SSL/TLS & Cryptography Mandate
- **Strict Mode Only**: Never use "Flexible" SSL (allows unencrypted plain HTTP between Cloudflare and origin, creating MITM vulnerabilities). Always enforce **Full (Strict)**.
- **TLS 1.3 & HSTS**: Enforce minimum TLS 1.2 (recommend TLS 1.3); enable HSTS with `max-age=31536000; includeSubDomains; preload`.
- **Automatic HTTPS Rewrites**: Enable to eliminate mixed-content warnings.

### 2. DNS & Proxy Configuration
- **Orange Cloud (Proxied)**: Enable for web HTTP/HTTPS traffic needing CDN caching, DDoS mitigation, and WAF protection.
- **Grey Cloud (DNS Only)**: Mandate for mail servers (MX, SPF, DKIM, DMARC), SSH/FTP, or direct non-HTTP origins.
- **CNAME Flattening**: Use on apex domain (`example.com`) to allow root CNAME pointing to Pages or external SaaS without breaking RFC 1034.

### 3. Cloudflare Workers & Pages Deployment
- Maintain declarative `wrangler.toml`:
  ```toml
  name = "edge-service"
  main = "src/index.ts"
  compatibility_date = "2026-09-01"
  compatibility_flags = ["nodejs_compat"]

  [vars]
  ENVIRONMENT = "production"

  [[kv_namespaces]]
  binding = "CACHE_KV"
  id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  ```
- Deploy via CI/CD using `wrangler deploy` with scoped API tokens (`CLOUDFLARE_API_TOKEN`). Never use global API keys.

### 4. WAF & Edge Defense Architecture
- **Rate Limiting Rule**: Limit mutation endpoints (e.g. `/api/auth/login`, `/api/checkout`) to 10 requests per minute per IP. Action: Managed Challenge.
- **Turnstile Integration**: Replace invasive CAPTCHAs with Cloudflare Turnstile token verification server-side via `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
- **Bot Fight Mode**: Enable for automated scraping prevention, with explicit bypass for known verified search engines.

### 5. Caching & Cache-Control Rules
- **Edge Cache TTL**: Set Cache Rules to respect origin `Cache-Control` headers.
- **Bypass on Dynamic Routes**: Explicit rule bypassing cache on `/api/*`, `/admin/*`, and requests containing `session`, `token`, or `auth` cookies.
- **Static Assets**: Set `Cache-Control: public, max-age=31536000, immutable` for hashed JS/CSS/image bundles.

### 6. Ephemeral Quick Tunnels (`try.cloudflare.com` & Agency Workflows)
Ephemeral tunnels provision an immediate, publicly accessible HTTPS URL (`https://<random-id>.trycloudflare.com`) pointing to any local port without requiring a Cloudflare account, domain name, or open router ports:

1. **One-Command Ingress via CLI**:
   ```bash
   # Run via repository tunnel script
   bun devops/scripts/tunnel.ts 3000

   # Or direct cloudflared binary
   cloudflared tunnel --url http://localhost:3000

   # Or Docker one-liner (zero local installation)
   docker run --rm -it --net=host cloudflare/cloudflared:latest tunnel --url http://localhost:3000
   ```
2. **Agency Core Use Cases**:
   - **Client Live Previews**: Share real-time local Next.js/Astro builds with clients during review calls without spinning up temporary Vercel/Fly preview branches.
   - **External Webhook Simulation**: Receive real payment events from Stripe, Razorpay, Lemon Squeezy, or Shopify directly into local API endpoints (`/api/webhooks/stripe`).
   - **Real-Device Mobile & Cellular QA**: Test responsive layouts, WebGL/Three.js performance, and touch interactions on physical iOS/Android devices running on cellular 5G networks (bypassing local WiFi subnet restrictions).

### 7. Zero Trust Tunnels (`cloudflared`) & Homelab Architecture
For home servers, Proxmox VE, TrueNAS SCALE, Home Assistant, and local Ollama inference clusters where port forwarding (ports 80/443) is hazardous or impossible due to ISP CGNAT (Carrier-Grade NAT):

1. **Tunnel Architecture**:
   - Outbound-only encrypted QUIC/HTTP2 connection from homelab host to Cloudflare Edge.
   - Router firewall keeps **all inbound ports closed**.
   - Cloudflare Edge terminates public HTTPS, applies DDoS protection, and forwards requests down the established tunnel.

2. **docker-compose Deployment (Homelab / Proxmox VM)**:
   ```yaml
   services:
     cloudflared:
       image: cloudflare/cloudflared:latest
       container_name: cloudflared-homelab
       restart: unless-stopped
       command: tunnel --no-autoupdate run
       environment:
         - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN} # Stored in untracked .env
       networks:
         - homelab-net

     homeassistant:
       image: ghcr.io/home-assistant/home-assistant:stable
       container_name: homeassistant
       restart: unless-stopped
       networks:
         - homelab-net

   networks:
     homelab-net:
       driver: bridge
   ```

3. **Cloudflare Access (Zero Trust Security Layer)**:
   - Put private services (e.g. `dash.homelab.yourdomain.com`, `ollama.homelab.yourdomain.com`) behind Cloudflare Access policies:
     - **Human Access**: Require GitHub / Google OAuth + Email One-Time PIN (OTP).
     - **Agent / API Access**: Generate Cloudflare **Service Tokens** (`CF-Access-Client-Id` and `CF-Access-Client-Secret`) so remote agents can securely query local LLMs/APIs without public exposure.

## Quality gate

- [ ] SSL/TLS configured as Full (Strict). Flexible mode strictly forbidden.
- [ ] Apex CNAME flattening configured without breaking root DNS.
- [ ] Sensitive API tokens scoped to zone; no global API keys in repos.
- [ ] Cache bypass rules verified for authenticated sessions and mutation APIs.
- [ ] Turnstile server-side verification implemented on public forms.
- [ ] Origin ingress ports (80/443) closed on homelab/origin when using Zero Trust tunnels.
- [ ] Ephemeral quick tunnels (`try.cloudflare.com`) restricted to temporary dev/QA sessions.
- [ ] Homelab admin dashboards protected by Cloudflare Access policies (OAuth/OTP/Service Tokens).

## Sources

- Cloudflare Official Architecture Center & Workers Best Practices.
- OWASP Edge & Reverse Proxy Security Hardening Guidelines.
- Cloudflare Zero Trust & Tunnel Engineering Documentation (`try.cloudflare.com`).
