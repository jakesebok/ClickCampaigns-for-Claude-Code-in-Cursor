# User-facing VAPI copy: use full domain names

**Rule:** In any copy shown to assessment takers, portal users, or email recipients, **do not use internal codes** (PH, IA, ME, AF, RS, FA, CO, WI, VS, EX, OH, EC) or question ids (e.g. RS6, PH6) unless you also spell out what they mean.

**OK to keep codes in:**

- Data structures: `domainCode`, quiz `id`, scoring keys, API payloads
- Developer comments and internal diagnostics (not emailed to clients)

**Use full names in prose, for example:**

| Code | User-facing name |
|------|------------------|
| PH | Physical Health |
| IA | Inner Alignment |
| ME | Mental / Emotional Health |
| AF | Attention & Focus |
| RS | Relationship to Self |
| FA | Family |
| CO | Community |
| WI | World / Impact |
| VS | Vision / Strategy |
| EX | Execution |
| OH | Operational Health |
| EC | Ecology |

**Related source bundles (keep in sync when editing interpretation copy):**

- `output-assets/html/vapi-drivers.js` and `jake-sebok-marketing-website/public/vapi/vapi-drivers.js`
- `aligned-ai-os/lib/vapi/drivers.ts`
- `output-assets/lib/journeyman/*.js` and `jake-sebok-marketing-website/public/vapi/lib/journeyman/*.js`
- Assessment email gate text in `vapi-assessment-complete` handler + Next route mirror
