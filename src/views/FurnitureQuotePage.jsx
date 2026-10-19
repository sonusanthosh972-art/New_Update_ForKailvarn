'use client';

import { ChefHat } from 'lucide-react';

import ServiceQuoteLayout from '@/components/quote/ServiceQuoteLayout.jsx';
import FurnitureQuoteWizard from '@/components/quote/FurnitureQuoteWizard.jsx';

const included = [
  'Free site measurement & 3D design',
  'Made to fit your exact wall and room size',
  'Branded HDHMR / plywood with matching edge bands',
  'Soft-close hinges and drawer channels',
  'Installation by our own carpenters',
  'Warranty on furniture and hardware',
];

const steps = [
  { title: 'Get your estimate', desc: 'Pick the furniture, sizes and finish above. It takes about a minute.' },
  { title: 'Free measurement', desc: 'Our designer measures every wall so each piece fits perfectly.' },
  { title: '3D design & fixed price', desc: 'See your furniture in 3D and get a written price. No surprises later.' },
  { title: 'Built & installed', desc: 'Everything is made, fitted and handed over clean, on the agreed date.' },
];

const faqs = [
  {
    q: 'How are wardrobes priced?',
    a: 'Per square foot of the front: width × height. A 6 ft wide, 7 ft tall wardrobe is 42 sq ft. The rate covers the full depth of the unit with shelves, hanging rod and drawers inside. Lofts above are priced the same way at a lower rate.',
  },
  {
    q: 'Which finish should I choose?',
    a: 'Laminate is the most popular: durable, scratch resistant and easy to clean. Acrylic gives a high-gloss modern look, veneer brings real wood grain, and PU paint offers any colour in a premium finish.',
  },
  {
    q: 'Is this estimate the final price?',
    a: 'It is a close estimate based on the sizes you entered. After the free site measurement and 3D design, you get a fixed written quotation, and anything extra is only done with your written approval.',
  },
  {
    q: 'How long does it take?',
    a: 'Usually 20 to 30 days from design approval, depending on how many pieces you order. Installation on site takes 2 to 5 days.',
  },
  {
    q: 'Do you make furniture in our home or in a factory?',
    a: 'Panels are cut and edge-banded by machine for a clean factory finish, then assembled and fitted at your home by our own carpenters, so there is far less dust and noise.',
  },
];

export default function FurnitureQuotePage() {
  return (
    <ServiceQuoteLayout
      anchor="furniture-quote"
      hero={{
        image: 'https://images.unsplash.com/photo-1631889993877-71e193bf79b8',
        eyebrow: 'Custom Furniture Quote',
        title: 'Get an Instant Price for Your Custom Furniture',
        emphasis: 'Custom Furniture',
        lead: 'Wardrobes, beds, TV units and more, made to fit your rooms. Pick what you need and see an itemised estimate in about a minute.',
        badges: ['Free 3D Design', 'Made to Measure', 'Fixed Written Price'],
      }}
      renderWizard={(onShown) => <FurnitureQuoteWizard onQuoteShown={onShown} />}
      includedTitle="Every piece includes"
      included={included}
      aside={{
        Icon: ChefHat,
        title: 'Planning a new kitchen too?',
        text: 'Get an instant modular kitchen estimate by layout, material and countertop.',
        href: '/kitchen-quote',
        cta: 'Get a Kitchen Quote',
      }}
      steps={steps}
      faqs={faqs}
      whatsappText="Hi KailVarn! I'd like a quote for custom furniture."
    />
  );
}
