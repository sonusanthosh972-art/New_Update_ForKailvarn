'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, MessageCircle, Phone } from 'lucide-react';

import PageHero from '@/components/kv/PageHero.jsx';
import Reveal from '@/components/kv/Reveal.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Page shell for the kitchen and furniture quote pages, same layout as the
// painting quote page: hero, wizard + sidebar, how it works, FAQ.
// `renderWizard(onQuoteShown)` returns the wizard.
export default function ServiceQuoteLayout({ hero, anchor, renderWizard, included, includedTitle, aside, steps, faqs, whatsappText }) {
  // Once the quotation is showing it takes the full width; the sidebar moves below it.
  const [quoteShown, setQuoteShown] = useState(false);
  // The hero is hidden while the quotation shows, so jump to the top where it now starts.
  useEffect(() => {
    if (quoteShown) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [quoteShown]);

  return (
    <div className="bg-[#FAFAF7] text-[#111111]">
      {!quoteShown && <PageHero {...hero} />}

      <section id={anchor} className="kv-section scroll-mt-24 bg-[#FAFAF7]">
        <div className="kv-wrap">
          <div className={`grid grid-cols-1 items-start gap-10 lg:gap-12 ${quoteShown ? '' : 'lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]'}`}>
            <Reveal>
              <div className="rounded-lg border-t-[4px] border-[#D9A441] bg-white p-6 shadow-card md:p-10">
                {renderWizard(setQuoteShown)}
              </div>
            </Reveal>

            <Reveal delay={0.15} className={quoteShown ? 'grid grid-cols-1 items-start gap-6 md:grid-cols-2' : 'space-y-6'}>
              <div className="rounded-lg border border-[#0B103B]/10 bg-white p-6">
                <h3 className="font-serif text-[22px] text-[#0B103B]">{includedTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-nunito text-[14.5px] leading-[1.55] text-[#2A2A2A]">
                      <CheckCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#D9A441]" strokeWidth={1.75} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-[#0B103B] p-6 text-white">
                <aside.Icon className="h-7 w-7 text-[#F2B21B]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-3 font-serif text-[22px]">{aside.title}</h3>
                <p className="mt-2 font-nunito text-[14.5px] leading-[1.6] text-white/75">{aside.text}</p>
                <Link href={aside.href} className="btn-primary mt-5 w-full">
                  {aside.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-lg border border-[#0B103B]/10 bg-[#F5F1E8] p-5">
                <p className="font-nunito text-[15px] font-bold text-[#111111]">Rather talk to us?</p>
                <div className="mt-3 flex flex-col gap-1">
                  <a href="tel:8401226123" className="inline-flex min-h-[40px] items-center gap-2 font-nunito text-[15px] font-bold text-[#8A6A1C] hover:underline">
                    <Phone className="h-4 w-4" aria-hidden="true" /> Call 8401226123
                  </a>
                  <a
                    href={`https://wa.me/918401226123?text=${encodeURIComponent(whatsappText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-2 font-nunito text-[15px] font-bold text-[#1A8F47] hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="kv-section bg-[#F5F1E8]">
        <div className="kv-wrap">
          <Reveal as="h2" className="kv-subhead">How it works</Reveal>
          <div className="relative">
            <span className="absolute left-[12%] right-[12%] top-[54px] hidden h-px bg-[#D9A441]/60 lg:block" aria-hidden="true" />
            <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 0.08} className="relative rounded-lg border border-[#0B103B]/10 bg-white p-6 text-center">
                  <span className="mx-auto mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-white bg-[#F2B21B] font-serif text-[24px] font-bold text-[#0B103B] shadow-md">
                    {i + 1}
                  </span>
                  <h3 className="font-nunito text-[16px] font-bold text-[#0B103B]">{step.title}</h3>
                  <p className="mt-2 font-nunito text-[15px] leading-[1.65] text-[#57534C]">{step.desc}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap max-w-[860px]">
          <Reveal as="h2" className="kv-subhead">Questions families ask us</Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-lg border border-[#0B103B]/10 bg-white px-5 sm:px-6">
                <AccordionTrigger className="py-5 text-left font-nunito text-[16px] font-bold text-[#0B103B] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 font-nunito text-[15px] leading-[1.7] text-[#57534C]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center">
            <a href={`#${anchor}`} className="btn-primary">
              Get My Free Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
