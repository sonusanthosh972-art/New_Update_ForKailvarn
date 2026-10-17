'use client';

import {
  Printer, Phone, Mail, MapPin, CheckCircle2, Users, ShieldCheck,
  FileText, Calendar, Clock, PaintRoller, Calculator, Check,
} from 'lucide-react';

// Indian numbering in words: 182750 -> "One Lakh Eighty-Two Thousand Seven Hundred Fifty".
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
function twoDigits(n) {
  return n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ''}`;
}
export function inWords(amount) {
  let n = Math.round(amount);
  if (!n) return 'Zero';
  const parts = [];
  for (const [size, name] of [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand'], [100, 'Hundred']]) {
    const count = Math.floor(n / size);
    if (count) parts.push(`${count >= 100 ? inWords(count) : twoDigits(count)} ${name}`);
    n %= size;
  }
  if (n) parts.push(twoDigits(n));
  return parts.join(' ');
}

// "KV-PT-261016-4821". `tail` (e.g. the end of the saved lead's id) keeps it
// traceable; without one a random 4-digit tail is used.
export function quotationNo(prefix, tail) {
  const d = new Date();
  const ymd = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('');
  const end = tail ? String(tail).slice(-4).toUpperCase() : String(Math.floor(1000 + Math.random() * 9000));
  return `KV-${prefix}-${ymd}-${end}`;
}

const VALID_DAYS = 14;
const formatDate = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
export const validUntil = () => formatDate(new Date(Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000));

const cleanCurrency = (val) => {
  if (!val) return '—';
  return String(val).replace(/^[₹\s]+/, '').trim();
};

function getSectionIcon(title) {
  const t = title.toLowerCase();
  if (t.includes('separate') || t.includes('exclude') || t.includes('extra') || t.includes('paint')) {
    return PaintRoller;
  }
  if (t.includes('basis') || t.includes('price') || t.includes('calculate') || t.includes('budget')) {
    return Calculator;
  }
  if (t.includes('spec') || t.includes('package') || t.includes('include')) {
    return ShieldCheck;
  }
  return FileText;
}

export default function Quotation({ subtitle, quoteNo, customer, items, totals, sections = [], notes = [] }) {
  const showRate = items.some((it) => it.rate);

  // Extract verdict / final price section
  const verdictIndex = sections.findIndex(
    (s) => s.featured || s.title?.toLowerCase().includes('final price')
  );
  const verdict = verdictIndex >= 0 ? sections[verdictIndex] : null;
  const otherSections = verdictIndex >= 0
    ? sections.filter((_, idx) => idx !== verdictIndex)
    : sections;

  return (
    <div className="w-full">
      <article
        aria-label={`Your ${subtitle.toLowerCase()}`}
        className="kv-print-area relative overflow-hidden rounded-2xl border border-[#0B103B]/15 bg-white text-left shadow-[0_20px_50px_-20px_rgba(11,16,59,0.35)]"
      >
        {/* Top Header with ambient visual background on right */}
        <header className="relative overflow-hidden bg-gradient-to-r from-white via-white/95 to-[#FAF5EB] p-5 sm:p-8 border-b border-[#0B103B]/10">
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 opacity-25 bg-cover bg-right bg-no-repeat"
            style={{
              backgroundImage: `url('/offers/diwali-living-room-1280.webp')`,
              maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0) 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-6">
            <div>
              <img src="/brand/kailvarn-wordmark.png" alt="KailVarn" width={180} height={28} className="h-7 w-auto" />
              <p className="mt-1 font-nunito text-[13px] font-semibold text-[#57534C]">
                Painting &amp; Interiors · Silvassa &amp; Vapi
              </p>
              <div className="mt-3.5 space-y-1.5 font-nunito text-[12.5px] text-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#D9A441]" />
                  <span>Phone / WhatsApp: +91 84012 26123</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#D9A441]" />
                  <span>infokailvarn@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#D9A441]" />
                  <span>Silvassa &amp; Vapi</span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right self-stretch sm:self-auto flex flex-col items-start sm:items-end">
              <h3 className="font-playfair text-[32px] sm:text-[38px] font-bold uppercase tracking-[0.12em] text-[#0B103B] leading-none">
                QUOTATION
              </h3>
              <p className="mt-1.5 font-nunito text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#D9A441]">
                {subtitle}
              </p>
              <div className="mt-2.5 h-[3px] w-14 bg-[#D9A441] rounded-full sm:ml-auto" />
            </div>
          </div>

          {/* 3 Trust Badges Bar */}
          <div className="relative z-10 mt-6 pt-5 border-t border-[#0B103B]/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF0D7] text-[#D9A441]">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <span className="font-nunito text-[12px] font-bold text-[#0B103B] leading-tight">
                Quality Paints<br /><span className="font-normal text-[#57534C]">&amp; Materials</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF0D7] text-[#D9A441]">
                <Users className="h-4.5 w-4.5" />
              </div>
              <span className="font-nunito text-[12px] font-bold text-[#0B103B] leading-tight">
                Skilled &amp;<br /><span className="font-normal text-[#57534C]">Experienced Team</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF0D7] text-[#D9A441]">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <span className="font-nunito text-[12px] font-bold text-[#0B103B] leading-tight">
                Clean &amp;<br /><span className="font-normal text-[#57534C]">Hassle-Free Work</span>
              </span>
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <div className="p-5 sm:p-8">
          {/* Quotation for + Reference */}
          <div className="rounded-xl border border-[#F3E7CA] bg-[#FFFDF7] p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:divide-x sm:divide-[#F0DFA8]">
              {/* Left: Customer */}
              <div className="text-left">
                <p className="font-nunito text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#D9A441]">
                  QUOTATION FOR
                </p>
                <p className="mt-1 font-nunito text-[17px] font-extrabold text-[#0B103B]">{customer.name}</p>
                <p className="font-nunito text-[13px] text-[#57534C] mt-0.5">{customer.place}</p>
                <p className="font-nunito text-[13px] font-semibold text-[#2A2A2A] mt-0.5">
                  +91 {customer.phone}
                </p>
                {customer.email && <p className="font-nunito text-[12.5px] text-[#57534C] mt-0.5">{customer.email}</p>}
              </div>

              {/* Right: Reference details */}
              <div className="sm:pl-6 text-left flex flex-col justify-center gap-2 font-nunito text-[13px]">
                <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                  <span className="flex items-center gap-2 font-medium text-[#57534C] min-w-[110px]">
                    <FileText className="h-4 w-4 text-[#D9A441]" />
                    <span>Quotation No.</span>
                  </span>
                  <span className="font-bold tabular-nums text-[#0B103B]">{quoteNo}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                  <span className="flex items-center gap-2 font-medium text-[#57534C] min-w-[110px]">
                    <Calendar className="h-4 w-4 text-[#D9A441]" />
                    <span>Date</span>
                  </span>
                  <span className="font-bold tabular-nums text-[#0B103B]">{formatDate(new Date())}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                  <span className="flex items-center gap-2 font-medium text-[#57534C] min-w-[110px]">
                    <Clock className="h-4 w-4 text-[#D9A441]" />
                    <span>Valid until</span>
                  </span>
                  <span className="font-bold tabular-nums text-[#0B103B]">{validUntil()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-5 overflow-x-auto rounded-xl border border-[#0B103B]/10">
            <table className="w-full min-w-[520px] border-collapse font-nunito text-[13px]">
              <thead>
                <tr className="bg-[#0B103B] text-white text-[12px] font-bold uppercase tracking-[0.06em]">
                  <th scope="col" className="w-16 px-4 py-3 text-center border-r border-white/10">S.NO.</th>
                  <th scope="col" className="px-4 py-3 text-left border-r border-white/10">DESCRIPTION OF WORK</th>
                  <th scope="col" className="w-24 px-4 py-3 text-center border-r border-white/10">QTY</th>
                  {showRate && <th scope="col" className="w-28 px-4 py-3 text-center border-r border-white/10">RATE (₹)</th>}
                  <th scope="col" className="w-32 px-4 py-3 text-right">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={it.desc} className="border-b border-[#0B103B]/10 last:border-b-0 align-middle">
                    <td className="px-3 py-3.5 text-center tabular-nums text-[#0B103B] border-r border-[#0B103B]/10">{i + 1}</td>
                    <td className="px-4 py-3.5 text-left border-r border-[#0B103B]/10">
                      <span className="block font-bold text-[#0B103B] text-[13.5px]">{it.desc}</span>
                      {it.sub && <span className="block text-[12px] text-[#57534C] mt-0.5">{it.sub}</span>}
                      {it.detail && <span className="block text-[12px] text-[#57534C] mt-0.5">{it.detail}</span>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center text-[#2A2A2A] border-r border-[#0B103B]/10">{it.qty}</td>
                    {showRate && (
                      <td className="whitespace-nowrap px-3 py-3.5 text-center tabular-nums text-[#2A2A2A] border-r border-[#0B103B]/10">
                        {cleanCurrency(it.rate)}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold tabular-nums text-[#0B103B]">
                      {cleanCurrency(it.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Original price -> discount -> Final Price */}
          <div className="mt-5 rounded-xl bg-[#FAF7F0] p-4 sm:p-5">
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center justify-between font-nunito text-[13.5px]">
                <span className="text-[#57534C]">{totals.discount ? 'Original price' : 'Sub-total'}</span>
                <span className={`tabular-nums ${totals.discount ? 'text-[#57534C] line-through decoration-[#57534C]/70 font-semibold' : 'text-[#0B103B] font-bold'}`}>
                  {totals.subtotal}
                </span>
              </div>
              {totals.discount && (
                <div className="flex items-center justify-between font-nunito text-[14px]">
                  <span className="font-bold text-[#D02626]">{totals.discount.label}</span>
                  <span className="font-bold tabular-nums text-[#D02626]">− {totals.discount.amount}</span>
                </div>
              )}
            </div>

            {/* Divider line before Final Price */}
            <div className="border-t border-[#E8C874] pt-3 mt-2" />

            {/* Giant Final Price Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-md bg-gradient-to-r from-[#FCE8B3] via-[#FFF1D0] to-[#FDE5A3] p-3 sm:px-4 sm:py-3.5 border-l-4 border-l-[#E5A82E] shadow-sm">
              <div className="text-left">
                <p className="font-sans font-black text-[26px] sm:text-[32px] text-[#081534] tracking-tight leading-none">
                  {totals.totalTitle || 'Final Price'}
                </p>
                <p className="font-sans font-bold text-[13px] sm:text-[14px] text-[#1E254A] mt-1 tracking-tight">
                  ({totals.totalLabel || 'Estimated Amount'})
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-b from-[#F7BE48] to-[#E59E20] px-6 sm:px-8 py-2 sm:py-2.5 shadow-[0_2px_8px_rgba(229,158,32,0.35)] flex items-center justify-center shrink-0 self-start sm:self-auto">
                <span className="font-sans font-black text-[28px] sm:text-[34px] text-[#081534] tracking-tight tabular-nums leading-none">
                  {String(totals.total).replace(/^₹(?!\s)/, '₹ ')}
                </span>
              </div>
            </div>

            {/* Verdict pill card */}
            {verdict && (
              <div className="mt-3.5 flex items-center gap-3.5 rounded-xl border border-[#E5B54F] bg-[#FFFDF7] p-3.5 text-left">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D9A441] text-white shadow-sm">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
                <div className="font-nunito text-[12.5px] sm:text-[13px] font-semibold text-[#2A2A2A] leading-snug">
                  {verdict.items ? (
                    <ul className="space-y-1">
                      {verdict.items.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  ) : (
                    <p>
                      {verdict.lead && <span className="font-extrabold text-[#0B103B]">{verdict.lead}:</span>}{' '}
                      {verdict.text}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Amount in Words */}
          {totals.words > 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#D5E1EF] bg-[#EEF3F9] p-3 sm:p-3.5 text-left">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4E3F5] text-[#2C5282]">
                <FileText className="h-4 w-4" />
              </div>
              <p className="font-nunito text-[12.5px] sm:text-[13px] text-[#2A2A2A] leading-snug">
                <span className="font-bold text-[#0B103B]">Amount in words:</span>{' '}
                Rupees {inWords(totals.words)} Only
              </p>
            </div>
          )}

          {/* Points Table (2-column cards) */}
          {otherSections.length > 0 && (
            <div className={`mt-5 grid grid-cols-1 gap-5 ${otherSections.length >= 2 ? 'md:grid-cols-2' : ''}`}>
              {otherSections.map((s) => {
                const Icon = getSectionIcon(s.title);
                return (
                  <div key={s.title} className="rounded-2xl border border-[#0B103B]/10 bg-white p-5 shadow-sm text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF0D7] text-[#D9A441] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="font-nunito text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#8A6A1C]">
                        {s.title}
                      </h4>
                    </div>
                    <div className="mt-3.5 font-nunito text-[12.5px] sm:text-[13px] leading-[1.65] text-[#333333]">
                      {s.items ? (
                        <ul className="space-y-1.5 pl-1">
                          {s.items.map((x) => (
                            <li key={x} className="flex items-start gap-2.5">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A441]" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{s.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sign-off */}
          <div className="mt-8 border-t border-[#0B103B]/15 pt-8 flex flex-col sm:flex-row items-end justify-between gap-6 font-nunito text-[12px]">
            <div className="w-56 text-left">
              <div className="border-t border-[#0B103B]/30 mb-2" />
              <p className="font-bold text-[#0B103B] text-[13px]">Customer acceptance</p>
              <p className="text-[#666666] text-[11.5px] mt-0.5">Name &amp; Signature</p>
            </div>
            <div className="w-56 text-left sm:text-right">
              <div className="border-t border-[#0B103B]/30 mb-2 sm:ml-auto" />
              <p className="text-[#0B103B] text-[13px]">For <strong className="font-bold text-[#0B103B]">KailVarn</strong></p>
              <p className="text-[#666666] text-[11.5px] mt-0.5">Authorised signatory</p>
            </div>
          </div>

          {/* Bottom dark banner */}
          <div className="-mx-5 -mb-5 sm:-mx-8 sm:-mb-8 mt-8 bg-[#0B103B] py-3.5 px-4 text-center text-white font-nunito text-[12px] tracking-wide rounded-b-lg">
            This is a system-generated estimate. Thank you for choosing KailVarn.
          </div>
        </div>
      </article>

      <div className="kv-no-print mt-5 flex justify-center">
        <button type="button" onClick={() => window.print()} className="btn-outline-dark">
          <Printer className="h-[18px] w-[18px]" aria-hidden="true" /> Print / Save as PDF
        </button>
      </div>

      {/* Below the quotation: what's included and terms */}
      {notes.length > 0 && (
        <div className="kv-no-print mt-6 grid grid-cols-1 gap-6 rounded-lg border border-[#0B103B]/10 bg-[#FAF7F0] p-5 text-left sm:p-7 md:grid-cols-2">
          {notes.map((s) => (
            <section key={s.title} className="break-inside-avoid">
              <h4 className="font-nunito text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A6A1C]">{s.title}</h4>
              <div className="mt-1.5 font-nunito text-[12.5px] leading-[1.6] text-[#2A2A2A]">
                {s.items ? (
                  s.numbered ? (
                    <ol className="list-decimal space-y-0.5 pl-4">{s.items.map((t) => <li key={t}>{t}</li>)}</ol>
                  ) : (
                    <ul className="list-disc space-y-0.5 pl-4 marker:text-[#D9A441]">{s.items.map((x) => <li key={x}>{x}</li>)}</ul>
                  )
                ) : (
                  <p>{s.text}</p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
