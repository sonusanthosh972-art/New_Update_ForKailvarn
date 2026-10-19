'use client';

import { Box } from 'lucide-react';

import ServiceQuoteLayout from '@/components/quote/ServiceQuoteLayout.jsx';
import KitchenQuoteWizard from '@/components/quote/KitchenQuoteWizard.jsx';

const included = [
  'Free site measurement & 3D kitchen design',
  'Branded HDHMR / plywood with matching edge bands',
  'Soft-close hinges and drawer channels',
  'Granite or quartz countertop fixing',
  'Installation by our own carpenters',
  'Warranty on cabinets and hardware',
];

const steps = [
  { title: 'Get your estimate', desc: 'Pick layout, materials and add-ons above. It takes about a minute.' },
  { title: 'Free measurement', desc: 'Our designer measures your kitchen and checks plumbing and gas points.' },
  { title: '3D design & fixed price', desc: 'See your kitchen in 3D and get a written price. No surprises later.' },
  { title: 'Built & installed', desc: 'Cabinets are made, fitted and handed over clean, on the agreed date.' },
];

const faqs = [
  {
    q: 'How is a modular kitchen priced?',
    a: 'By running foot: the total length of your counters. The rate depends on the board (HDHMR or plywood), the shutter finish (laminate, acrylic, PU) and the hardware. Countertop and add-ons like a tall unit or chimney are added separately, exactly as your estimate shows.',
  },
  {
    q: 'HDHMR or plywood: which is better for a kitchen?',
    a: 'Both work well. HDHMR is moisture resistant, termite proof and gives the best value. BWP marine plywood is fully waterproof and is the safest choice under the sink. Many families use plywood for the sink cabinet and HDHMR elsewhere; our designer will advise at the visit.',
  },
  {
    q: 'Is this estimate the final price?',
    a: 'It is a close estimate based on typical sizes. After the free site measurement and 3D design, you get a fixed written quotation, and anything extra is only done with your written approval.',
  },
  {
    q: 'How long does it take?',
    a: 'Usually 25 to 35 days from design approval: manufacturing takes most of it, and installation on site takes 3 to 5 days.',
  },
  {
    q: 'Can you also do the plumbing, tiles and electricals?',
    a: 'Yes. Dado tiles and lights are in the add-ons; plumbing, gas pipe shifting and electrical points are quoted after the site visit since they depend on your kitchen.',
  },
];

export default function KitchenQuotePage() {
  return (
    <ServiceQuoteLayout
      anchor="kitchen-quote"
      hero={{
        image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8',
        eyebrow: 'Modular Kitchen Quote',
        title: 'Get an Instant Price for Your Modular Kitchen',
        emphasis: 'Modular Kitchen',
        lead: 'Choose your layout, materials and fittings and see an itemised estimate in about a minute. Then get a free site measurement and 3D design.',
        badges: ['Free 3D Design', 'Branded Materials', 'Fixed Written Price'],
      }}
      renderWizard={(onShown) => <KitchenQuoteWizard onQuoteShown={onShown} />}
      includedTitle="Every kitchen includes"
      included={included}
      aside={{
        Icon: Box,
        title: 'Need wardrobes or a TV unit too?',
        text: 'Get a quick estimate for wardrobes, beds, TV units and more, made to fit your rooms.',
        href: '/furniture-quote',
        cta: 'Get a Furniture Quote',
      }}
      steps={steps}
      faqs={faqs}
      whatsappText="Hi KailVarn! I'd like a quote for a modular kitchen."
    />
  );
}
