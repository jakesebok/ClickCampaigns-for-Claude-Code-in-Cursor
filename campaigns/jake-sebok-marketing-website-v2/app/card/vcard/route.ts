import { CARD } from "@/lib/card/contact";
import { CARD_PHOTO_JPEG_B64 } from "@/lib/card/photo-base64";

/**
 * Serves Jake's contact as a downloadable vCard (.vcf). Tapping "Save my
 * contact" on /card hits this; phones open their add-contact sheet with the
 * fields (and his photo) pre-filled. Single source of truth is
 * lib/card/contact.ts; the embedded photo is lib/card/photo-base64.ts.
 *
 * vCard 3.0 with CRLF line endings (the most compatible across iOS Contacts,
 * Google Contacts, and Outlook). The embedded PHOTO is base64 JPEG, folded to
 * 75 octets per line with leading-space continuations per RFC 2425/2426.
 */
function foldPhotoLines(b64: string): string[] {
  const content = `PHOTO;ENCODING=b;TYPE=JPEG:${b64}`;
  const out: string[] = [content.slice(0, 75)];
  for (let i = 75; i < content.length; i += 74) {
    out.push(" " + content.slice(i, i + 74));
  }
  return out;
}

export function GET() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${CARD.lastName};${CARD.firstName};;;`,
    `FN:${CARD.fullName}`,
    `ORG:${CARD.org}`,
    `TITLE:${CARD.title}`,
    `TEL;TYPE=CELL,VOICE:${CARD.phone}`,
    `EMAIL;TYPE=WORK,INTERNET:${CARD.email}`,
    `URL:${CARD.website}`,
    ...CARD.socials.map((s) => `URL:${s.url}`),
    ...foldPhotoLines(CARD_PHOTO_JPEG_B64),
    `NOTE:${CARD.tagline}`,
    "END:VCARD",
  ];
  const body = lines.join("\r\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${CARD.firstName}-${CARD.lastName}.vcf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
