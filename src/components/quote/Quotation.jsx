'use client';

import { Printer } from 'lucide-react';

// Printed-style quotation shared by the painting quote (/painting-quote) and
// the interior estimate (/get-free-quote): letterhead, "quotation for" and
// reference, item table, totals (with an optional offer discount and the
// amount in words), notes sections, terms and sign-off.
// "Print / Save as PDF" prints only this block (.kv-print-area in globals.css).
// All amounts arrive already formatted, so each wizard keeps its own maths.

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

function Section({ title, children }) {
  return (
    <section className="break-inside-avoid">
      <h4 className="font-nunito text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A6A1C]">{title}</h4>
      <div className="mt-1.5 font-nunito text-[12.5px] leading-[1.6] text-[#2A2A2A]">{children}</div>
    </section>
  );
}

const Bullets = ({ items }) => (
  <ul className="list-disc space-y-0.5 pl-4 marker:text-[#D9A441]">
    {items.map((x) => <li key={x}>{x}</li>)}
  </ul>
);

/**
 * customer: { name, place, phone, email }
 * items:    [{ desc, sub, qty, rate?, amount }]  (Rate column shows only if some item has one)
 * totals:   { subtotal, discount?: { label, amount }, total, totalLabel, savings?, words? (number) }
 * sections: [{ title, items?: string[], text?: string }]  the required notes, printed inside the quotation
 * notes:    same shape (+ numbered?), shown below the quotation (what's included, terms)
 */
export default function Quotation({ subtitle, quoteNo, customer, items, totals, sections, notes = [] }) {
  const showRate = items.some((it) => it.rate);
  return (
    <div className="w-full">
      <article aria-label={`Your ${subtitle.toLowerCase()}`} className="kv-print-area overflow-hidden rounded-lg border border-[#0B103B]/10 bg-white text-left shadow-[0_18px_40px_-24px_rgba(11,16,59,0.45)]">
        <div className="h-1.5 bg-gradient-to-r from-[#D9A441] via-[#F2B21B] to-[#D9A441]" aria-hidden="true" />
        <div className="p-5 sm:p-8">
          {/* Letterhead */}
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#0B103B]/10 pb-5">
            <div>
              <img src="/brand/kailvarn-wordmark.png" alt="KailVarn" width={156} height={24} className="h-6 w-auto" />
              <p className="mt-2 font-nunito text-[12.5px] leading-[1.6] text-[#57534C]">
                Painting &amp; Interiors · Silvassa &amp; Vapi<br />
                Phone / WhatsApp: +91 84601 50027<br />
                kailvarn0@gmail.com
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-playfair text-[26px] font-semibold uppercase leading-none tracking-[0.12em] text-[#0B103B] sm:text-[30px]">Quotation</h3>
              <p className="mt-1.5 font-nunito text-[12px] font-bold uppercase tracking-[0.12em] text-[#8A6A1C]">{subtitle}</p>
            </div>
          </header>

          {/* Quotation for + reference */}
          <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-nunito text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8A6A1C]">Quotation for</p>
              <p className="mt-1 font-nunito text-[16px] font-bold text-[#0B103B]">{customer.name}</p>
              <p className="font-nunito text-[13px] leading-[1.6] text-[#57534C]">
                {customer.place}<br />+91 {customer.phone}{customer.email && <><br />{customer.email}</>}
              </p>
            </div>
            <dl className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1 font-nunito text-[13px]">
              <dt className="text-right font-bold text-[#8A6A1C]">Quotation No.</dt><dd className="text-right tabular-nums text-[#0B103B]">{quoteNo}</dd>
              <dt className="text-right font-bold text-[#8A6A1C]">Date</dt><dd className="text-right tabular-nums text-[#0B103B]">{formatDate(new Date())}</dd>
              <dt className="text-right font-bold text-[#8A6A1C]">Valid until</dt><dd className="text-right tabular-nums text-[#0B103B]">{validUntil()}</dd>
            </dl>
          </div>

          {/* Items */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse font-nunito text-[13px]">
              <thead>
                <tr className="bg-[#0B103B] text-left text-[12px] font-bold uppercase tracking-[0.06em] text-white">
                  <th scope="col" className="w-10 px-3 py-2.5">S.No.</th>
                  <th scope="col" className="px-3 py-2.5">Description of work</th>
                  <th scope="col" className="px-3 py-2.5">Qty</th>
                  {showRate && <th scope="col" className="px-3 py-2.5 text-right">Rate</th>}
                  <th scope="col" className="px-3 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={it.desc} className="border-b border-[#0B103B]/10 align-top">
                    <td className="px-3 py-3 tabular-nums text-[#0B103B]">{i + 1}</td>
                    <td className="px-3 py-3">
                      <span className="block font-bold text-[#0B103B]">{it.desc}</span>
                      {it.sub && <span className="block text-[12px] text-[#57534C]">{it.sub}</span>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[#2A2A2A]">{it.qty}</td>
                    {showRate && <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-[#2A2A2A]">{it.rate || '—'}</td>}
                    <td className="whitespace-nowrap px-3 py-3 text-right font-bold tabular-nums text-[#0B103B]">{it.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Original price -> discount -> amount */}
          <dl className="ml-auto mt-4 max-w-[380px] font-nunito text-[13.5px]">
            <div className="flex justify-between gap-4 px-3 py-1.5">
              <dt className="text-[#57534C]">{totals.discount ? 'Original price' : 'Sub-total'}</dt>
              <dd className={`tabular-nums ${totals.discount ? 'text-[#57534C] line-through decoration-[#8E1B1F]/60' : 'text-[#0B103B]'}`}>{totals.subtotal}</dd>
            </div>
            {totals.discount && (
              <div className="flex justify-between gap-4 px-3 py-1.5">
                <dt className="font-bold text-[#8E1B1F]">{totals.discount.label}</dt>
                <dd className="font-bold tabular-nums text-[#8E1B1F]">− {totals.discount.amount}</dd>
              </div>
            )}
            <div className="mt-1 flex items-baseline justify-between gap-4 rounded-md border-t-2 border-[#D9A441] bg-[#FFFBF0] px-3 py-2.5">
              <dt className="font-extrabold uppercase tracking-[0.06em] text-[#0B103B]">{totals.totalLabel}</dt>
              <dd className="text-right font-playfair text-[22px] font-semibold tabular-nums text-[#0B103B]">{totals.total}</dd>
            </div>
            {totals.savings && <p className="px-3 pt-1.5 text-right text-[12px] font-bold text-[#1F7A4D]">You save {totals.savings}</p>}
          </dl>
          {totals.words > 0 && (
            <p className="mt-3 border-y border-[#0B103B]/10 py-2 font-nunito text-[12.5px] text-[#2A2A2A]">
              <span className="font-bold text-[#0B103B]">Amount in words:</span> Rupees {inWords(totals.words)} Only
            </p>
          )}

          {/* Required notes */}
          <div className={`mt-7 grid grid-cols-1 gap-6 border-t border-[#0B103B]/10 pt-6 ${sections.length >= 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {sections.map((s) => (
              <Section key={s.title} title={s.title}>
                {s.items ? <Bullets items={s.items} /> : <p>{s.text}</p>}
              </Section>
            ))}
          </div>

          {/* Sign-off */}
          <div className="mt-10 flex flex-wrap items-end justify-between gap-8 font-nunito text-[12px] text-[#57534C]">
            <div className="w-[190px] text-center">
              <div className="border-t border-[#0B103B]/40" />
              <p className="mt-1.5">Customer acceptance</p>
            </div>
            <div className="w-[190px] text-center">
              <p className="mb-6 font-bold text-[#0B103B]">For KailVarn</p>
              <div className="border-t border-[#0B103B]/40" />
              <p className="mt-1.5">Authorised signatory</p>
            </div>
          </div>
          <p className="mt-6 border-t border-[#0B103B]/10 pt-3 text-center font-nunito text-[11.5px] text-[#57534C]">
            This is a system-generated estimate. Thank you for choosing KailVarn.
          </p>
        </div>
      </article>
      <div className="kv-no-print mt-4 flex justify-center">
        <button type="button" onClick={() => window.print()} className="btn-outline-dark">
          <Printer className="h-[18px] w-[18px]" aria-hidden="true" /> Print / Save as PDF
        </button>
      </div>

      {/* Below the quotation: what's included and the terms */}
      {notes.length > 0 && (
        <div className="kv-no-print mt-6 grid grid-cols-1 gap-6 rounded-lg border border-[#0B103B]/10 bg-[#FAF7F0] p-5 text-left sm:p-7 md:grid-cols-2">
          {notes.map((s) => (
            <Section key={s.title} title={s.title}>
              {s.items ? (s.numbered ? (
                <ol className="list-decimal space-y-0.5 pl-4">{s.items.map((t) => <li key={t}>{t}</li>)}</ol>
              ) : <Bullets items={s.items} />) : <p>{s.text}</p>}
            </Section>
          ))}
        </div>
      )}
    </div>
  );
}
