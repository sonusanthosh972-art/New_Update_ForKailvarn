'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Lock, MapPin, MessageCircle, Minus, Plus } from 'lucide-react';

import { LOCATIONS } from '@/constants/estimateConfig.js';
import { CARPENTRY_TIMING } from '@/constants/carpentryQuotes.js';
import { useWhatsAppLink } from '@/hooks/useWhatsAppLink.js';
import { Field, OptionCard, ProgressBar, StepHeading } from '@/components/estimate/WizardParts.jsx';

// Pieces shared by the kitchen and furniture quote wizards: the step frame,
// location and contact steps, choice cards and the thank-you screen. Same look
// and flow as the painting PaintQuoteWizard.

export const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const labelOf = (list, id) => list.find((x) => x.id === id)?.label || '';
// "Base price" for the cheapest option, "+18%" for the others.
export const costNote = (factor) => (factor === 1 ? 'Base price' : `+${Math.round((factor - 1) * 100)}%`);

// Progress bar, animated step body, Back / Next. `canContinue` gates Next;
// `skippable` turns its label into "Skip". The last step renders its own buttons.
export function WizardFrame({ steps, step, setStep, canContinue, skippable, children }) {
  const [direction, setDirection] = useState(1);
  const topRef = useRef(null);
  const last = steps.length - 1;
  const go = (next) => { setDirection(next > step ? 1 : -1); setStep(next); };

  // Keep the top of the wizard in view when the step changes (phones).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  return (
    <div ref={topRef} className="scroll-mt-28">
      <ProgressBar steps={steps} step={step} />
      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.21, 1] }}
          >
            {children(go)}
          </motion.div>
        </AnimatePresence>
      </div>
      {step < last && (
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#0B103B]/10 pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg px-3 font-nunito text-[14px] font-bold text-[#0B103B] hover:bg-[#0B103B]/[0.05]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
            </button>
          ) : <span />}
          <button type="button" disabled={!canContinue} onClick={() => go(step + 1)} className="btn-primary min-w-[160px]">
            {skippable ? 'Skip' : 'Next'} <ArrowRight className="kv-arrow h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

// Single-choice cards with a hint and an optional cost note on the right.
export function ChoiceList({ label, options, value, onChange, note, columns = 'sm:grid-cols-2' }) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid grid-cols-1 gap-3 ${columns}`}>
      {options.map((o) => (
        <OptionCard key={o.id} selected={value === o.id} onClick={() => onChange(o.id)} className="p-4 pr-9">
          <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className="font-nunito text-[15.5px] font-bold text-[#0B103B]">{o.label}</span>
            {note && note(o) && <span className="font-nunito text-[12px] font-bold text-[#8A6A1C]">{note(o)}</span>}
          </span>
          {o.hint && <span className="mt-0.5 block font-nunito text-[12.5px] leading-[1.5] text-[#57534C]">{o.hint}</span>}
        </OptionCard>
      ))}
    </div>
  );
}

// − n + control.
export function Counter({ value, onChange, min = 0, max = 50, label }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-[#0B103B]/15 bg-white">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Less ${label}`} className="flex h-11 w-11 items-center justify-center text-[#0B103B] hover:bg-[#0B103B]/[0.05] disabled:opacity-30">
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" aria-label={`${label}: ${value}`} className="w-10 text-center font-nunito text-[16px] font-bold tabular-nums text-[#0B103B]">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`} className="flex h-11 w-11 items-center justify-center text-[#0B103B] hover:bg-[#0B103B]/[0.05] disabled:opacity-30">
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function LocationStep({ idPrefix, sel, update, lead }) {
  return (
    <>
      <StepHeading title="Where is your home?" lead={lead || 'We work across Silvassa, Vapi and areas within about 50 km.'} />
      <div role="radiogroup" aria-label="City" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LOCATIONS.map((city) => (
          <OptionCard key={city} selected={sel.city === city} onClick={() => update({ city })} className="flex items-center gap-2.5 p-4">
            <MapPin className="h-4 w-4 shrink-0 text-[#D9A441]" aria-hidden="true" />
            <span className="font-nunito text-[15px] font-bold text-[#0B103B]">{city}</span>
          </OptionCard>
        ))}
      </div>
      <label htmlFor={`${idPrefix}-locality`} className="mb-[6px] mt-8 block font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">
        Society / area name <span className="font-normal text-[#57534C]">(optional)</span>
      </label>
      <input
        id={`${idPrefix}-locality`}
        type="text"
        maxLength={80}
        value={sel.locality}
        onChange={(e) => update({ locality: e.target.value })}
        placeholder={sel.city === 'Other nearby' ? 'e.g. Kachigam, Dunetha…' : 'e.g. Amli, GIDC, Chala…'}
        className="form-input-base form-input-focus"
      />
    </>
  );
}

export function TimingPicker({ sel, update }) {
  return (
    <>
      <p className="mb-3 mt-8 font-nunito text-[13.5px] font-semibold text-[#2A2A2A]">When do you want it done?</p>
      <ChoiceList label="Timing" options={CARPENTRY_TIMING} value={sel.timing} onChange={(timing) => update({ timing: sel.timing === timing ? '' : timing })} columns="sm:grid-cols-3" />
    </>
  );
}

export const placeOf = (sel) => (sel.locality.trim() ? `${sel.city}, ${sel.locality.trim()}` : sel.city);

// Name / phone / email / notes. `onSend(form)` saves the lead and returns
// submitLead()'s result; on success `onDone(customer)` gets the cleaned details.
export function ContactStep({ idPrefix, notesPlaceholder, onBack, onSend, onDone }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', notes: '', whatsapp: true, website: '' },
  });

  const onSubmit = async (form) => {
    setError('');
    const phone = form.phone.replace(/\D/g, '').slice(-10);
    const result = await onSend({ ...form, phone, notes: form.notes.trim() });
    if (!result.ok) {
      setError(Object.values(result.fields || {})[0] || result.message);
      return;
    }
    const name = form.name.trim().replace(/\s+/g, ' ');
    onDone({ name, first: name.split(' ')[0], phone, email: form.email.trim(), quoteNo: result.quoteNo });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative">
      <StepHeading title="Your estimate is ready" lead="Tell us where our designer can reach you and we'll show your itemised estimate right away." />
      {/* Spam trap: hidden from people, bots fill it in */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0" {...register('website')} />

      <div className="space-y-5">
        <Field id={`${idPrefix}-name`} label="Full name" error={errors.name?.message}>
          <input id={`${idPrefix}-name`} type="text" autoComplete="name" placeholder="e.g. Rahul Patel"
            {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Please enter your name' } })}
            className={`form-input-base ${errors.name ? 'form-input-error' : 'form-input-focus'}`} />
        </Field>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field id={`${idPrefix}-phone`} label="Mobile number" error={errors.phone?.message}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-nunito text-[15px] text-[#57534C]">+91</span>
              <input id={`${idPrefix}-phone`} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210"
                {...register('phone', { required: 'Please enter your mobile number', validate: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10)) || 'Enter a valid 10-digit mobile number' })}
                className={`form-input-base pl-[52px] ${errors.phone ? 'form-input-error' : 'form-input-focus'}`} />
            </div>
          </Field>
          <Field id={`${idPrefix}-email`} label={<>Email <span className="font-normal text-[#57534C]">(optional)</span></>} error={errors.email?.message}>
            <input id={`${idPrefix}-email`} type="email" autoComplete="email" placeholder="name@example.com"
              {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })}
              className={`form-input-base ${errors.email ? 'form-input-error' : 'form-input-focus'}`} />
          </Field>
        </div>
        <Field id={`${idPrefix}-notes`} label={<>Anything we should know? <span className="font-normal text-[#57534C]">(optional)</span></>}>
          <textarea id={`${idPrefix}-notes`} rows={3} maxLength={1000} placeholder={notesPlaceholder}
            {...register('notes')} className="form-input-base form-input-focus resize-none" />
        </Field>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" {...register('whatsapp')} className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#D9A441]" />
          <span className="font-nunito text-[14px] text-[#2A2A2A]">Contact me on WhatsApp</span>
        </label>
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg border border-[#C62828]/30 bg-[#C62828]/[0.06] px-4 py-3 font-nunito text-[14px] text-[#8C1D18]">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#0B103B]/10 pt-6">
        <button type="button" onClick={onBack} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg px-3 font-nunito text-[14px] font-bold text-[#0B103B] hover:bg-[#0B103B]/[0.05]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[200px]">
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</>
            : <>See my quote <ArrowRight className="kv-arrow h-4 w-4" aria-hidden="true" /></>}
        </button>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-nunito text-[12px] text-[#57534C]">
        <Lock className="h-3 w-3 shrink-0" aria-hidden="true" /> Free site measurement. No obligation. We never spam or share your number.
      </p>
    </form>
  );
}

// Thank-you screen around the quotation.
export function ThankYou({ customer, message, whatsappText, onRestart, children }) {
  const { openWhatsApp } = useWhatsAppLink();
  return (
    <div className="py-4 text-center" role="status">
      <div className="animate-scale-in mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2B21B]/15">
        <CheckCircle2 className="h-9 w-9 text-[#D9A441]" aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-playfair text-[26px] font-medium leading-tight text-[#0B103B] md:text-[30px]">Thank you, {customer.first}!</h2>
      <p className="mx-auto mt-3 max-w-[460px] font-nunito text-[15px] leading-[1.7] text-[#57534C]">{message}</p>
      <div className="mt-8">{children}</div>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => openWhatsApp('', whatsappText)} className="kv-btn bg-[#25D366] text-white hover:bg-[#1FB457]">
          <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" /> WhatsApp us now
        </button>
      </div>
      <button type="button" onClick={onRestart} className="mt-5 min-h-[44px] font-nunito text-[13.5px] font-bold text-[#8A6A1C] underline-offset-2 hover:underline">
        Start a new quote
      </button>
    </div>
  );
}
