'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { submitLead } from '@/lib/submitLead.js';
import {
  BOARDS, CARPENTRY_TIMING, COUNTERTOPS, FINISHES, HARDWARE, KITCHEN_ADDONS, KITCHEN_BASE_RATE, KITCHEN_LAYOUTS,
  KITCHEN_MAX_RFT, KITCHEN_MIN_RFT, KITCHEN_UNITS, KITCHEN_WALL_RATE,
} from '@/constants/carpentryQuotes.js';
import { OptionCard, StepHeading } from '@/components/estimate/WizardParts.jsx';
import Quotation, { quotationNo, validUntil } from '@/components/quote/Quotation.jsx';
import { ChoiceList, ContactStep, LocationStep, ThankYou, TimingPicker, WizardFrame, costNote, inr, labelOf, placeOf } from '@/components/quote/QuoteFlow.jsx';

// Modular kitchen quote: layout & size -> location -> board -> shutter finish
// & hardware -> countertop -> add-ons & timing -> contact -> quotation.
// Priced like Indian modular-kitchen brands: cabinets per running foot,
// scaled by board, finish and hardware, plus countertop per running foot and
// fixed-price add-ons (src/constants/carpentryQuotes.js). Saved through
// /api/quotes with the choices in projectType / budget / message.

const STEPS = ['Layout', 'Location', 'Board', 'Finish', 'Countertop', 'Add-ons', 'Details'];
const EMPTY = {
  layout: '', rft: '', units: 'both', city: '', locality: '', board: '', finish: '', hardware: 'softclose',
  countertop: '', addons: [], timing: '',
};

const find = (list, id) => list.find((x) => x.id === id);
const validRft = (v) => Number(v) >= KITCHEN_MIN_RFT && Number(v) <= KITCHEN_MAX_RFT;

export function kitchenQuote(sel) {
  const board = find(BOARDS, sel.board);
  const finish = find(FINISHES, sel.finish);
  const hardware = find(HARDWARE, sel.hardware);
  const top = find(COUNTERTOPS, sel.countertop);
  if (!validRft(sel.rft) || !board || !finish || !hardware || !top) return null;
  const rft = Number(sel.rft);
  const base = KITCHEN_BASE_RATE + (sel.units === 'both' ? KITCHEN_WALL_RATE : 0);
  const rate = Math.round((base * board.factor * finish.factor * hardware.factor) / 50) * 50;
  const cabinets = rate * rft;
  const counter = top.rate * rft;
  const addons = KITCHEN_ADDONS.filter((a) => sel.addons.includes(a.id));
  const total = cabinets + counter + addons.reduce((s, a) => s + a.price, 0);
  return { rft, rate, cabinets, top, counter, addons, total, board, finish, hardware };
}

export default function KitchenQuoteWizard({ onQuoteShown }) {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(EMPTY);
  const [sent, setSent] = useState(null);
  const update = (patch) => setSel((s) => ({ ...s, ...patch }));

  useEffect(() => { onQuoteShown?.(Boolean(sent)); }, [sent, onQuoteShown]);

  const quote = kitchenQuote(sel);
  const spec = quote && `${quote.board.label} · ${quote.finish.label} · ${quote.hardware.label} hardware`;
  const summary = [
    `Kitchen: ${labelOf(KITCHEN_LAYOUTS, sel.layout)}, ${sel.rft} running ft (${labelOf(KITCHEN_UNITS, sel.units).toLowerCase()})`,
    `Location: ${placeOf(sel)}`,
    spec && `Material: ${spec}`,
    `Countertop: ${labelOf(COUNTERTOPS, sel.countertop)}`,
    sel.addons.length > 0 && `Add-ons: ${sel.addons.map((id) => labelOf(KITCHEN_ADDONS, id)).join(', ')}`,
    sel.timing && `When: ${labelOf(CARPENTRY_TIMING, sel.timing)}`,
    quote && `Estimated quote: ${inr(quote.total)}`,
  ].filter(Boolean);

  const send = async (form) => {
    const quoteNo = quotationNo('KT');
    const result = await submitLead('/api/quotes', {
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: placeOf(sel),
      service: 'Modular Kitchen',
      projectType: `${labelOf(KITCHEN_LAYOUTS, sel.layout)} kitchen · ${sel.rft} rft`,
      budget: quote ? `${inr(quote.total)} (${quote.board.label}, ${quote.finish.label})` : '',
      contactMethod: form.whatsapp ? 'WhatsApp' : 'Phone call',
      source: 'Kitchen quote page',
      message: [`Quote #: ${quoteNo}`, ...summary.slice(2), form.notes && `Notes: ${form.notes}`].filter(Boolean).join('\n'),
      website: form.website,
    });
    return { ...result, quoteNo };
  };

  const restart = () => { setSent(null); setSel(EMPTY); setStep(0); };

  if (sent) {
    return (
      <ThankYou
        customer={sent}
        message="Our kitchen designer will call you shortly to fix a free site measurement and show you 3D designs."
        whatsappText={`Hi KailVarn, I just requested a modular kitchen quote.\n\n${summary.join('\n')}`}
        onRestart={restart}
      >
        {quote && <KitchenQuotation customer={sent} sel={sel} quote={quote} />}
      </ThankYou>
    );
  }

  const canContinue = [
    Boolean(sel.layout && validRft(sel.rft)), Boolean(sel.city), Boolean(sel.board), Boolean(sel.finish && sel.hardware), Boolean(sel.countertop), true,
  ][step];

  return (
    <WizardFrame steps={STEPS} step={step} setStep={setStep} canContinue={canContinue} skippable={step === 5 && !sel.addons.length && !sel.timing}>
      {(go) => (
        <>
          {step === 0 && <LayoutStep sel={sel} update={update} />}
          {step === 1 && <LocationStep idPrefix="kq" sel={sel} update={update} />}
          {step === 2 && (
            <>
              <StepHeading title="Which board for the cabinets?" lead="The carcass is the body of every cabinet. All our boards are branded and termite-treated." />
              <ChoiceList label="Cabinet board" options={BOARDS} value={sel.board} onChange={(board) => update({ board })} note={(o) => costNote(o.factor)} columns="" />
            </>
          )}
          {step === 3 && (
            <>
              <StepHeading title="Pick a shutter finish" lead="The finish is what you see and touch every day." />
              <ChoiceList label="Shutter finish" options={FINISHES} value={sel.finish} onChange={(finish) => update({ finish })} note={(o) => costNote(o.factor)} />
              <p className="mb-3 mt-8 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">Hinges & drawer channels</p>
              <ChoiceList label="Hardware" options={HARDWARE} value={sel.hardware} onChange={(hardware) => update({ hardware })} note={(o) => costNote(o.factor)} columns="sm:grid-cols-3" />
            </>
          )}
          {step === 4 && (
            <>
              <StepHeading title="Choose your countertop" lead="Priced per running foot of counter, with cutting, polishing and fixing." />
              <ChoiceList label="Countertop" options={COUNTERTOPS} value={sel.countertop} onChange={(countertop) => update({ countertop })} note={(o) => (o.rate ? `${inr(o.rate)} / ft` : 'No charge')} columns="" />
            </>
          )}
          {step === 5 && <AddonsStep sel={sel} update={update} />}
          {step === 6 && <ContactStep idPrefix="kq" notesPlaceholder="e.g. need space for a dishwasher, gas pipeline to be shifted" onBack={() => go(5)} onSend={send} onDone={setSent} />}
        </>
      )}
    </WizardFrame>
  );
}

function LayoutStep({ sel, update }) {
  const invalid = sel.rft !== '' && !validRft(sel.rft);
  return (
    <>
      <StepHeading title="What shape is your kitchen?" lead="Pick the closest layout. We fill in a typical size you can change." />
      <div role="radiogroup" aria-label="Kitchen layout" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {KITCHEN_LAYOUTS.map((l) => (
          <OptionCard key={l.id} selected={sel.layout === l.id} onClick={() => sel.layout !== l.id && update({ layout: l.id, rft: String(l.rft) })} className="p-4 pr-8">
            <LayoutIcon id={l.id} />
            <span className="mt-3 block font-nunito text-[16px] font-bold text-[#0B103B]">{l.label}</span>
            <span className="mt-0.5 block font-nunito text-[12.5px] text-[#57534C]">{l.hint}</span>
          </OptionCard>
        ))}
      </div>

      {sel.layout && (
        <div className="mt-5 rounded-xl border border-[#0B103B]/10 bg-[#FAF7F0] p-4">
          <label htmlFor="kq-rft" className="mb-[6px] block font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">
            Total counter length
          </label>
          <div className="relative max-w-[240px]">
            <input
              id="kq-rft"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={sel.rft}
              onChange={(e) => update({ rft: e.target.value.replace(/\D/g, '').slice(0, 2) })}
              aria-invalid={invalid || !sel.rft}
              aria-describedby="kq-rft-hint"
              className={`form-input-base pr-24 ${invalid ? 'form-input-error' : 'form-input-focus'}`}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-nunito text-[14px] text-[#57534C]">running ft</span>
          </div>
          <p id="kq-rft-hint" className={`mt-1.5 font-nunito text-[12.5px] ${invalid || !sel.rft ? 'text-[#8C1D18]' : 'text-[#57534C]'}`}>
            {invalid || !sel.rft
              ? `Enter a length between ${KITCHEN_MIN_RFT} and ${KITCHEN_MAX_RFT} ft.`
              : 'Add up the length of every counter wall. Not sure? Keep this typical size.'}
          </p>
        </div>
      )}

      <p className="mb-3 mt-8 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">Cabinets</p>
      <ChoiceList label="Cabinets" options={KITCHEN_UNITS} value={sel.units} onChange={(units) => update({ units })} />
      <p className="mt-6 font-nunito text-[13px] text-[#57534C]">
        Doing the whole home?{' '}
        <Link href="/get-free-quote" className="font-bold text-[#8A6A1C] underline-offset-2 hover:underline">Get a full interior estimate</Link>.
      </p>
    </>
  );
}

// Plan-view sketch of each layout (counters in gold).
function LayoutIcon({ id }) {
  const bars = {
    straight: ['M6 8h36'],
    l: ['M6 8h36', 'M6 8v28'],
    parallel: ['M6 8h36', 'M6 36h36'],
    u: ['M6 8h36', 'M6 8v28', 'M42 8v28'],
    island: ['M6 8h36', 'M16 28h16'],
  }[id];
  return (
    <svg viewBox="0 0 48 44" className="h-9 w-10" aria-hidden="true">
      <rect x="2" y="2" width="44" height="40" rx="3" fill="none" stroke="#0B103B" strokeOpacity="0.2" />
      {bars.map((d) => <path key={d} d={d} stroke="#D9A441" strokeWidth="6" strokeLinecap="round" fill="none" />)}
    </svg>
  );
}

function AddonsStep({ sel, update }) {
  const toggle = (id) => update({ addons: sel.addons.includes(id) ? sel.addons.filter((x) => x !== id) : [...sel.addons, id] });
  return (
    <>
      <StepHeading title="Add storage & fittings" lead="Optional. Each one you pick is added to your estimate." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {KITCHEN_ADDONS.map((a) => {
          const on = sel.addons.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => toggle(a.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-[border-color,background-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B] ${on ? 'border-[#D9A441] bg-[#FFFBF0]' : 'border-[#0B103B]/15 bg-white hover:border-[#D9A441]/60'}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block font-nunito text-[14.5px] font-bold text-[#0B103B]">{a.label}</span>
                <span className="block font-nunito text-[12px] text-[#57534C]">{a.hint}</span>
                <span className="mt-0.5 block font-nunito text-[12px] font-bold text-[#8A6A1C]">{inr(a.price)}</span>
              </span>
              <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-[#F2B21B]' : 'bg-[#0B103B]/20'}`} aria-hidden="true">
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </span>
            </button>
          );
        })}
      </div>
      <TimingPicker sel={sel} update={update} />
    </>
  );
}

const KITCHEN_INCLUDES = [
  'Free site measurement and 3D kitchen design',
  'Branded board, shutters and hardware as specified',
  'Edge banding, skirting and handles',
  'Delivery, installation and site cleaning',
  'Warranty on cabinets and workmanship',
];
const KITCHEN_EXCLUDES = ['Civil, plumbing and electrical changes', 'Gas pipeline shifting', 'Appliances unless listed above', 'False ceiling and painting'];

function KitchenQuotation({ customer, sel, quote }) {
  const layout = labelOf(KITCHEN_LAYOUTS, sel.layout);
  const items = [
    {
      desc: `Modular kitchen cabinets: ${layout}`,
      sub: `${quote.board.label} · ${quote.finish.label} shutters · ${quote.hardware.label} hardware`,
      detail: labelOf(KITCHEN_UNITS, sel.units),
      qty: `${quote.rft} rft`,
      rate: inr(quote.rate),
      amount: inr(quote.cabinets),
    },
    quote.counter > 0 && {
      desc: `${quote.top.label} countertop`,
      sub: 'Cutting, edge polishing and fixing',
      qty: `${quote.rft} rft`,
      rate: inr(quote.top.rate),
      amount: inr(quote.counter),
    },
    ...quote.addons.map((a) => ({ desc: a.label, sub: a.hint, qty: '1 No.', rate: inr(a.price), amount: inr(a.price) })),
  ].filter(Boolean);
  const excludes = KITCHEN_EXCLUDES.filter((x) => !(x.startsWith('Appliances') && sel.addons.includes('appliances')));

  return (
    <Quotation
      subtitle="Modular Kitchen Estimate"
      tagline="Modular Kitchens & Interiors · Silvassa & Vapi"
      materialsLabel="Branded Boards"
      image="/Kitchen.jpeg"
      quoteNo={customer.quoteNo}
      customer={{ ...customer, place: sel.locality.trim() ? `${sel.locality.trim()}, ${sel.city}` : sel.city }}
      items={items}
      totals={{ subtotal: inr(quote.total), total: inr(quote.total), totalTitle: 'Estimated Price', totalLabel: 'Including material & installation', words: quote.total }}
      sections={[
        { title: 'Final price', lead: 'Final price', text: 'Confirmed after free site measurement and 3D design approval.' },
        { title: 'Quoted separately', items: excludes },
        { title: 'Price basis', text: 'Cabinets and countertop are priced per running foot of counter. The final quotation uses the exact length measured at site.' },
      ]}
      notes={[
        { title: 'Scope of work included', items: KITCHEN_INCLUDES },
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
