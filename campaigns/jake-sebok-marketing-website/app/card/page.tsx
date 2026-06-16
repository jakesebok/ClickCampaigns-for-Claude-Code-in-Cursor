import type { Metadata } from "next";
import { CARD } from "@/lib/card/contact";
import { LogoOnDarkGlow } from "@/components/LogoOnDarkGlow";

/**
 * /card — Jake's digital business card. Standalone (the site header/footer +
 * floating CTA are suppressed for this route by components/SiteFrame.tsx),
 * mobile-first, branded to Aligned Power. Show the QR on your phone; a scan
 * opens this page; "Save my contact" downloads the vCard
 * (app/card/vcard/route.ts). All contact data lives in lib/card/contact.ts.
 */
export const metadata: Metadata = {
  title: `${CARD.fullName} · ${CARD.org}`,
  description: `${CARD.title}, ${CARD.org}. ${CARD.tagline} Save my contact or reach me directly.`,
  alternates: { canonical: "/card" },
  openGraph: {
    title: `${CARD.fullName} · ${CARD.org}`,
    description: `${CARD.title}, ${CARD.org}. ${CARD.tagline}`,
    images: [{ url: CARD.photo }],
  },
};

const phoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const mailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
);
const globeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
const compassIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
);
const linkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);

const CSS = `
.bizcard{min-height:100svh;background:radial-gradient(120% 80% at 50% -10%,rgba(255,107,26,0.20),transparent 60%),linear-gradient(180deg,#192236 0%,#0B0F19 100%);color:#F5F7FA;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px 56px;font-family:var(--font-outfit);}
.bizcard-inner{width:100%;max-width:420px;text-align:center;}
.bizcard-photo-wrap{width:128px;height:128px;margin:4px auto 22px;border-radius:999px;padding:4px;background:linear-gradient(135deg,#FF6B1A,#FF9F6B);box-shadow:0 14px 44px -14px rgba(255,107,26,0.55);}
.bizcard-photo{width:100%;height:100%;object-fit:cover;border-radius:999px;display:block;}
.bizcard-logo{margin:0 auto 20px;display:flex;justify-content:center;}
.bizcard-logo img{height:62px;width:auto;}
.bizcard-title{font-family:var(--font-cormorant);font-size:clamp(27px,7.5vw,33px);line-height:1.08;color:#fff;margin:0;font-weight:600;letter-spacing:0.005em;}
.bizcard-tagline{font-size:14px;color:#9AA8BD;margin:11px 0 26px;line-height:1.5;}
.bizcard-save{display:block;background:linear-gradient(135deg,#FF6B1A,#E55A0F);color:#fff;text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;font-size:13px;font-weight:600;padding:17px;border-radius:100px;box-shadow:0 16px 36px -16px rgba(255,107,26,0.75);transition:transform .15s ease;}
.bizcard-save:active{transform:scale(0.98);}
.bizcard-rows{margin-top:14px;display:flex;flex-direction:column;gap:10px;}
.bizcard-row{display:flex;align-items:center;gap:14px;text-align:left;text-decoration:none;color:#F5F7FA;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:13px 16px;transition:background .15s ease,border-color .15s ease;}
.bizcard-row:hover{background:rgba(255,107,26,0.10);border-color:rgba(255,107,26,0.4);}
.bizcard-row svg{width:20px;height:20px;color:#FF7E33;flex:0 0 auto;}
.bizcard-row .r-label{display:block;font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:#7A8FA8;margin-bottom:2px;}
.bizcard-row .r-value{display:block;font-size:14.5px;color:#F5F7FA;word-break:break-word;}
.bizcard-qr{margin-top:34px;display:flex;flex-direction:column;align-items:center;gap:12px;}
.bizcard-qr-label{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#FF7E33;}
.bizcard-qr img{width:212px;height:212px;background:#fff;padding:14px;border-radius:16px;box-shadow:0 16px 42px -16px rgba(0,0,0,0.7);}
.bizcard-qr span{font-size:11px;letter-spacing:0.07em;text-transform:uppercase;color:#7A8FA8;}
.bizcard-foot{margin-top:30px;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:#5D6478;}
@media(min-width:640px){.bizcard{align-items:center;padding:56px 24px;}.bizcard-inner{max-width:460px;}}
`;

export default function CardPage() {
  return (
    <main className="bizcard">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="bizcard-inner">
        <h1 className="sr-only">
          {CARD.fullName}, {CARD.org} — {CARD.title}
        </h1>

        <div className="bizcard-photo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bizcard-photo" src={CARD.photo} alt={CARD.fullName} />
        </div>

        <div className="bizcard-logo">
          <LogoOnDarkGlow size="lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo-on-dark-img" src={CARD.logo} alt={`${CARD.fullName}, ${CARD.org}`} />
          </LogoOnDarkGlow>
        </div>

        <div className="bizcard-title">{CARD.title}</div>
        <p className="bizcard-tagline">{CARD.tagline}</p>

        <a className="bizcard-save" href="/card/vcard">Save my contact</a>

        <div className="bizcard-rows">
          <a className="bizcard-row" href={`tel:${CARD.phone}`}>
            {phoneIcon}
            <span><span className="r-label">Call</span><span className="r-value">{CARD.phoneDisplay}</span></span>
          </a>
          <a className="bizcard-row" href={`mailto:${CARD.email}`}>
            {mailIcon}
            <span><span className="r-label">Email</span><span className="r-value">{CARD.email}</span></span>
          </a>
          <a className="bizcard-row" href={CARD.website} target="_blank" rel="noopener noreferrer">
            {globeIcon}
            <span><span className="r-label">Website</span><span className="r-value">{CARD.websiteDisplay}</span></span>
          </a>
          <a className="bizcard-row" href={CARD.workUrl}>
            {compassIcon}
            <span><span className="r-label">{CARD.workLabel}</span><span className="r-value">{CARD.workSub}</span></span>
          </a>
          {CARD.socials.map((s) => (
            <a key={s.url} className="bizcard-row" href={s.url} target="_blank" rel="noopener noreferrer">
              {linkIcon}
              <span><span className="r-label">{s.label}</span><span className="r-value">{s.url.replace(/^https?:\/\//, "")}</span></span>
            </a>
          ))}
        </div>

        <div className="bizcard-qr">
          <span className="bizcard-qr-label">Scan to open my card</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/card/qr.svg" alt="QR code that opens this card" width={212} height={212} />
          <span>Point a phone camera here</span>
        </div>

        <div className="bizcard-foot">{CARD.org} · {CARD.websiteDisplay}</div>
      </div>
    </main>
  );
}
