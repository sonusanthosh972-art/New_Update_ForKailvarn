'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { submitLead } from '@/lib/submitLead.js';
import { BOARDS, CARPENTRY_TIMING, FINISHES, FURNITURE_ITEMS, FURNITURE_ROOMS, HARDWARE } from '@/constants/carpentryQuotes.js';
import { StepHeading } from '@/components/estimate/WizardParts.jsx';
import Quotation, { quotationNo, validUntil } from '@/components/quote/Quotation.jsx';
import {
  ChoiceList, ContactStep, Counter, LocationStep, ThankYou, TimingPicker, WizardFrame, costNote, inr, labelOf, placeOf,
} from '@/components/quote/QuoteFlow.jsx';

// Custom furniture quote: pieces (with size / count) -> room & location ->
// board -> finish, hardware & timing -> contact -> quotation.
// Priced like Indian interior firms: wardrobes and lofts per sq ft of front
// area, other pieces at a fixed price by size, all scaled by board, finish
// and hardware (src/constants/carpentryQuotes.js). Saved through /api/quotes.

const STEPS = ['Furniture', 'Location', 'Board', 'Finish', 'Details'];
const EMPTY = { items: {}, rooms: [], city: '', locality: '', board: '', finish: '', hardware: 'softclose', timing: '' };
const find = (list, id) => list.find((x) => x.id === id);
const fresh = (item) => (item.kind === 'area'
  ? { count: 1, width: String(item.width), height: String(item.height) }
  : { count: 1, size: item.sizes[0].id });
const validDim = (v, max) => Number(v) >= 1 && Number(v) <= max;
const picked = (sel) => FURNITURE_ITEMS.filter((it) => sel.items[it.id]);
const itemsValid = (sel) => picked(sel).length > 0
  && picked(sel).every((it) => it.kind !== 'area' || (validDim(sel.items[it.id].width, it.maxWidth) && validDim(sel.items[it.id].height, it.maxHeight)));
const round100 = (n) => Math.round(n / 100) * 100;

export function furnitureQuote(sel) {
  const board = find(BOARDS, sel.board);
  const finish = find(FINISHES, sel.finish);
  const hardware = find(HARDWARE, sel.hardware);
  if (!itemsValid(sel) || !board || !finish || !hardware) return null;
  const factor = board.factor * finish.factor * hardware.factor;
  const lines = picked(sel).map((it) => {
    const c = sel.items[it.id];
    if (it.kind === 'area') {
      const w = Number(c.width);
      const h = Number(c.height);
      const area = w * h * c.count;
      const rate = Math.round((it.rate * factor) / 10) * 10;
      return { item: it, count: c.count, size: `${w} × ${h} ft`, area, rate, amount: round100(area * rate) };
    }
    const size = find(it.sizes, c.size);
    const unit = round100(size.price * factor);
    return { item: it, count: c.count, size: it.sizes.length > 1 ? size.label : '', rate: unit, amount: unit * c.count };
  });
  return { lines, board, finish, hardware, total: lines.reduce((s, l) => s + l.amount, 0) };
}

const lineName = (l) => `${l.item.label}${l.size ? ` (${l.size})` : ''}${l.count > 1 ? ` × ${l.count}` : ''}`;

export default function FurnitureQuoteWizard({ onQuoteShown }) {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(EMPTY);
  const [sent, setSent] = useState(null);
  const update = (patch) => setSel((s) => ({ ...s, ...patch }));

  useEffect(() => { onQuoteShown?.(Boolean(sent)); }, [sent, onQuoteShown]);

  const quote = furnitureQuote(sel);
  const pieces = picked(sel).map((it) => it.label);
  const summary = [
    `Furniture: ${quote ? quote.lines.map(lineName).join(', ') : pieces.join(', ')}`,
    sel.rooms.length > 0 && `For: ${sel.rooms.map((id) => labelOf(FURNITURE_ROOMS, id)).join(', ')}`,
    `Location: ${placeOf(sel)}`,
    quote && `Material: ${quote.board.label} · ${quote.finish.label} · ${quote.hardware.label} hardware`,
    sel.timing && `When: ${labelOf(CARPENTRY_TIMING, sel.timing)}`,
    quote && `Estimated quote: ${inr(quote.total)}`,
  ].filter(Boolean);

  const send = async (form) => {
    const quoteNo = quotationNo('FN');
    const result = await submitLead('/api/quotes', {
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: placeOf(sel),
      service: 'Custom Furniture',
      projectType: pieces.join(', ').slice(0, 80),
      budget: quote ? `${inr(quote.total)} (${quote.board.label}, ${quote.finish.label})` : '',
      contactMethod: form.whatsapp ? 'WhatsApp' : 'Phone call',
      source: 'Furniture quote page',
      message: [`Quote #: ${quoteNo}`, ...summary.filter((l) => !l.startsWith('Location')), form.notes && `Notes: ${form.notes}`].filter(Boolean).join('\n'),
      website: form.website,
    });
    return { ...result, quoteNo };
  };

  const restart = () => { setSent(null); setSel(EMPTY); setStep(0); };

  if (sent) {
    return (
      <ThankYou
        customer={sent}
        message="Our designer will call you shortly to fix a free site measurement and share 3D views of your furniture."
        whatsappText={`Hi KailVarn, I just requested a custom furniture quote.\n\n${summary.join('\n')}`}
        onRestart={restart}
      >
        {quote && <FurnitureQuotation customer={sent} sel={sel} quote={quote} />}
      </ThankYou>
    );
  }

  const canContinue = [itemsValid(sel), Boolean(sel.city), Boolean(sel.board), Boolean(sel.finish && sel.hardware)][step];

  return (
    <WizardFrame steps={STEPS} step={step} setStep={setStep} canContinue={canContinue}>
      {(go) => (
        <>
          {step === 0 && <ItemsStep sel={sel} update={update} />}
          {step === 1 && (
            <>
              <RoomPicker sel={sel} update={update} />
              <div className="mt-10"><LocationStep idPrefix="fq" sel={sel} update={update} /></div>
            </>
          )}
          {step === 2 && (
            <>
              <StepHeading title="Which board should we use?" lead="The board is the body of the furniture. All our boards are branded and termite-treated." />
              <ChoiceList label="Board" options={BOARDS} value={sel.board} onChange={(board) => update({ board })} note={(o) => costNote(o.factor)} columns="" />
            </>
          )}
          {step === 3 && (
            <>
              <StepHeading title="Pick a finish" lead="Applies to shutters and visible panels." />
              <ChoiceList label="Finish" options={FINISHES} value={sel.finish} onChange={(finish) => update({ finish })} note={(o) => costNote(o.factor)} />
              <p className="mb-3 mt-8 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">Hinges & drawer channels</p>
              <ChoiceList label="Hardware" options={HARDWARE} value={sel.hardware} onChange={(hardware) => update({ hardware })} note={(o) => costNote(o.factor)} columns="sm:grid-cols-3" />
              <TimingPicker sel={sel} update={update} />
            </>
          )}
          {step === 4 && <ContactStep idPrefix="fq" notesPlaceholder="e.g. sliding wardrobe with mirror, bed size 6 × 6.5 ft" onBack={() => go(3)} onSend={send} onDone={setSent} />}
        </>
      )}
    </WizardFrame>
  );
}

function ItemsStep({ sel, update }) {
  const setItem = (id, value) => {
    const items = { ...sel.items };
    if (value) items[id] = value; else delete items[id];
    update({ items });
  };
  return (
    <>
      <StepHeading title="What would you like made?" lead="Pick every piece you need. Set the size and how many." />
      <div className="space-y-3">
        {FURNITURE_ITEMS.map((it) => {
          const c = sel.items[it.id];
          return (
            <div key={it.id} className={`rounded-xl border transition-[border-color,background-color] duration-200 ${c ? 'border-[#D9A441] bg-[#FFFBF0]' : 'border-[#0B103B]/15 bg-white'}`}>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(c)}
                onClick={() => setItem(it.id, c ? null : fresh(it))}
                className="flex w-full items-center gap-3 rounded-xl p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-nunito text-[15px] font-bold text-[#0B103B]">{it.label}</span>
                  <span className="block font-nunito text-[12.5px] text-[#57534C]">{it.hint}</span>
                  <span className="mt-0.5 block font-nunito text-[12px] font-bold text-[#8A6A1C]">
                    {it.kind === 'area' ? `From ${inr(it.rate)} / sq ft` : `From ${inr(Math.min(...it.sizes.map((s) => s.price)))}`}
                  </span>
                </span>
                <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${c ? 'bg-[#F2B21B]' : 'bg-[#0B103B]/20'}`} aria-hidden="true">
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${c ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                </span>
              </button>
              {c && <ItemOptions item={it} value={c} onChange={(v) => setItem(it.id, v)} />}
            </div>
          );
        })}
      </div>
      <p className="mt-6 font-nunito text-[13px] text-[#57534C]">
        Doing the whole home?{' '}
        <Link href="/get-free-quote" className="font-bold text-[#8A6A1C] underline-offset-2 hover:underline">Get a full interior estimate</Link>.
      </p>
    </>
  );
}

function ItemOptions({ item, value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const dim = (key, max, label) => {
    const v = value[key];
    const bad = !validDim(v, max);
    const id = `fq-${item.id}-${key}`;
    return (
      <div>
        <label htmlFor={id} className="mb-1 block font-nunito text-[12.5px] font-semibold text-[#2A2A2A]">{label}</label>
        <div className="relative w-[120px]">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={v}
            onChange={(e) => set({ [key]: e.target.value.replace(/\D/g, '').slice(0, 2) })}
            aria-invalid={bad}
            className={`form-input-base pr-10 ${bad ? 'form-input-error' : 'form-input-focus'}`}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-nunito text-[13px] text-[#57534C]">ft</span>
        </div>
        {bad && <p className="mt-1 font-nunito text-[11.5px] text-[#8C1D18]">1 to {max} ft</p>}
      </div>
    );
  };
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4 border-t border-[#D9A441]/30 px-4 pb-4 pt-4">
      {item.kind === 'area' ? (
        <>
          {dim('width', item.maxWidth, 'Width')}
          {dim('height', item.maxHeight, 'Height')}
        </>
      ) : item.sizes.length > 1 && (
        <div role="radiogroup" aria-label={`${item.label} size`} className="flex flex-wrap gap-2">
          {item.sizes.map((s) => {
            const on = value.size === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set({ size: s.id })}
                className={`min-h-[44px] rounded-lg border px-3.5 font-nunito text-[13.5px] font-bold transition-colors ${on ? 'border-[#0B103B] bg-[#0B103B] text-white' : 'border-[#0B103B]/20 bg-white text-[#0B103B] hover:border-[#D9A441]'}`}
              >
                {s.label} <span className={`font-semibold ${on ? 'text-[#F6D47C]' : 'text-[#8A6A1C]'}`}>{inr(s.price)}</span>
              </button>
            );
          })}
        </div>
      )}
      <div>
        <p className="mb-1 font-nunito text-[12.5px] font-semibold text-[#2A2A2A]">How many</p>
        <Counter value={value.count} onChange={(count) => set({ count })} min={1} max={10} label={item.label.toLowerCase()} />
      </div>
    </div>
  );
}

function RoomPicker({ sel, update }) {
  const toggle = (id) => update({ rooms: sel.rooms.includes(id) ? sel.rooms.filter((x) => x !== id) : [...sel.rooms, id] });
  return (
    <>
      <StepHeading title="Which rooms is it for?" lead="Optional. Helps our designer plan the visit." />
      <div className="flex flex-wrap gap-2">
        {FURNITURE_ROOMS.map((r) => {
          const on = sel.rooms.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => toggle(r.id)}
              className={`min-h-[44px] rounded-full border px-4 font-nunito text-[14px] font-bold transition-colors ${on ? 'border-[#D9A441] bg-[#FFFBF0] text-[#0B103B]' : 'border-[#0B103B]/20 bg-white text-[#0B103B] hover:border-[#D9A441]/60'}`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

const FURNITURE_INCLUDES = [
  'Free site measurement and 3D design',
  'Branded board, finish and hardware as specified',
  'Edge banding, handles and internal fittings',
  'Delivery, installation and site cleaning',
  'Warranty on furniture and workmanship',
];
const FURNITURE_EXCLUDES = ['Mattress, mirrors and glass beyond the design', 'Electrical points and lighting', 'Civil work and painting', 'Loose furniture (sofa, dining chairs)'];

function FurnitureQuotation({ customer, sel, quote }) {
  const items = quote.lines.map((l) => (l.item.kind === 'area'
    ? {
      desc: `${l.item.label} (${l.size})`,
      sub: `${quote.board.label} · ${quote.finish.label} · ${quote.hardware.label} hardware`,
      detail: l.count > 1 ? `${l.count} units` : undefined,
      qty: `${l.area} sq ft`,
      rate: inr(l.rate),
      amount: inr(l.amount),
    }
    : {
      desc: `${l.item.label}${l.size ? ` (${l.size})` : ''}`,
      sub: `${quote.board.label} · ${quote.finish.label}`,
      detail: l.item.hint,
      qty: `${l.count} ${l.count > 1 ? 'Nos.' : 'No.'}`,
      rate: inr(l.rate),
      amount: inr(l.amount),
    }));

  return (
    <Quotation
      subtitle="Custom Furniture Estimate"
      tagline="Custom Furniture & Interiors · Silvassa & Vapi"
      materialsLabel="Branded Boards"
      image="/living-room-real.jpg"
      quoteNo={customer.quoteNo}
      customer={{ ...customer, place: sel.locality.trim() ? `${sel.locality.trim()}, ${sel.city}` : sel.city }}
      items={items}
      totals={{ subtotal: inr(quote.total), total: inr(quote.total), totalTitle: 'Estimated Price', totalLabel: 'Including material & installation', words: quote.total }}
      sections={[
        { title: 'Final price', lead: 'Final price', text: 'Confirmed after free site measurement and 3D design approval.' },
        { title: 'Quoted separately', items: FURNITURE_EXCLUDES },
        { title: 'Price basis', text: 'Wardrobes and lofts are priced per sq ft of front area (width × height); other pieces by size. The final quotation uses the sizes measured at site.' },
      ]}
      notes={[
        { title: 'Scope of work included', items: FURNITURE_INCLUDES },
        {
          title: 'Terms & conditions',
          numbered: true,
          items: [
            `This quotation is valid until ${validUntil()}.`,
            'Board, finish and hardware brands are confirmed in the final quotation.',
            'Any additional work is taken up only with your written approval.',
            'Installation schedule is confirmed at the time of booking.',
          ],
        },
      ]}
    />
  );
}
