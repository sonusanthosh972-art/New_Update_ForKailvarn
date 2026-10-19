import { pageMetadata } from '@/lib/seo.js';
import FurnitureQuotePage from '@/views/FurnitureQuotePage.jsx';

export const metadata = pageMetadata({
  title: 'Custom Furniture Cost Calculator: Silvassa & Vapi',
  description:
    'Instant estimate for wardrobes, storage beds, TV units and more in Silvassa, Vapi and Daman. Pick sizes, board and finish and see an itemised price. Free 3D design.',
  path: '/furniture-quote',
});

export default function Page() {
  return <FurnitureQuotePage />;
}
