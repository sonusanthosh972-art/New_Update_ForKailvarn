import { pageMetadata } from '@/lib/seo.js';
import KitchenQuotePage from '@/views/KitchenQuotePage.jsx';

export const metadata = pageMetadata({
  title: 'Modular Kitchen Price Calculator: Silvassa & Vapi',
  description:
    'Instant modular kitchen estimate for Silvassa, Vapi and Daman. Choose L-shaped, U-shaped or parallel layout, HDHMR or plywood, laminate or acrylic finish and see an itemised price.',
  path: '/kitchen-quote',
});

export default function Page() {
  return <KitchenQuotePage />;
}
