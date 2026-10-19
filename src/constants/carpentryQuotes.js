// Prices for the modular kitchen (/kitchen-quote) and custom furniture
// (/furniture-quote) estimates. Set for Silvassa / Vapi, a little below metro
// rate cards (HomeLane, Livspace, Design Cafe price kitchens per running foot
// and wardrobes per sq ft of front area, then scale by board and finish).
// Every amount is in rupees and includes material, hardware, making and
// installation. Change them here; the wizards and quotations read only this.

// ---- Board (carcass) and shutter finish: shared by kitchen and furniture ----

// `factor` scales the base rate, which is priced on HDHMR + laminate.
export const BOARDS = [
  { id: 'hdhmr', label: 'HDHMR board', hint: 'Moisture resistant, termite proof. Best value.', factor: 1 },
  { id: 'bwr', label: 'BWR plywood', hint: 'Boiling-water resistant ply. Sturdy and long-lasting.', factor: 1.18 },
  { id: 'bwp', label: 'BWP marine plywood', hint: 'Waterproof grade. Ideal near the sink and in damp areas.', factor: 1.32 },
];

export const FINISHES = [
  { id: 'laminate', label: 'Laminate', hint: 'Matte, suede or textured. Scratch resistant, easy to clean.', factor: 1 },
  { id: 'membrane', label: 'Membrane / PVC', hint: 'Seamless wrapped shutters with soft, routed designs.', factor: 1.1 },
  { id: 'acrylic', label: 'Acrylic', hint: 'Mirror-like high gloss. The modern premium look.', factor: 1.3 },
  { id: 'veneer', label: 'Wood veneer', hint: 'Real wood grain with a lacquer coat.', factor: 1.38 },
  { id: 'pu', label: 'PU / lacquer paint', hint: 'Any colour, glossy or matte. Top-end finish.', factor: 1.5 },
];

export const HARDWARE = [
  { id: 'standard', label: 'Standard', hint: 'Ebco / Hettich basic hinges and channels', factor: 1 },
  { id: 'softclose', label: 'Soft-close', hint: 'Hettich / Hafele soft-close throughout', factor: 1.08 },
  { id: 'premium', label: 'Premium', hint: 'Blum soft-close with lifetime warranty', factor: 1.16 },
];

// ---- Modular kitchen ----

// `rft`: typical running feet of counter for that layout (the customer can change it).
export const KITCHEN_LAYOUTS = [
  { id: 'straight', label: 'Straight', hint: 'One wall. Compact flats.', rft: 10 },
  { id: 'l', label: 'L-shaped', hint: 'Two walls. Most popular.', rft: 14 },
  { id: 'parallel', label: 'Parallel', hint: 'Two facing counters.', rft: 16 },
  { id: 'u', label: 'U-shaped', hint: 'Three walls. Lots of storage.', rft: 20 },
  { id: 'island', label: 'Island', hint: 'Wall counter + island.', rft: 20 },
];
export const KITCHEN_MIN_RFT = 6;
export const KITCHEN_MAX_RFT = 60;

// Per running foot, HDHMR + laminate + standard hardware.
export const KITCHEN_BASE_RATE = 6000; // base cabinets (below the counter)
export const KITCHEN_WALL_RATE = 4000; // wall cabinets (above the counter)

export const KITCHEN_UNITS = [
  { id: 'both', label: 'Base + wall cabinets', hint: 'Full storage above and below the counter' },
  { id: 'base', label: 'Base cabinets only', hint: 'Open shelves or tiles above the counter' },
];

// Per running foot of counter.
export const COUNTERTOPS = [
  { id: 'granite', label: 'Granite', hint: 'Black galaxy, tan brown, etc. Tough and heat proof.', rate: 1200 },
  { id: 'quartz', label: 'Quartz', hint: 'Stain resistant with a uniform, premium look.', rate: 2600 },
  { id: 'keep', label: 'Keep existing top', hint: 'Cabinets only, your counter stays.', rate: 0 },
];

// Fixed price each; picked ones are added to the estimate.
export const KITCHEN_ADDONS = [
  { id: 'tall', label: 'Tall pantry unit', hint: 'Floor-to-ceiling storage with pull-outs', price: 32000 },
  { id: 'loft', label: 'Loft cabinets', hint: 'Extra storage above the wall cabinets', price: 18000 },
  { id: 'baskets', label: 'Tandem drawers & baskets', hint: 'Cutlery, plate and bottle pull-outs', price: 14000 },
  { id: 'corner', label: 'Corner carousel', hint: 'Uses the blind corner of an L / U kitchen', price: 12000 },
  { id: 'sink', label: 'Steel sink & tap', hint: 'Single-bowl sink with drainboard and tap', price: 9500 },
  { id: 'appliances', label: 'Chimney & hob', hint: 'Auto-clean chimney with a 3-burner glass hob', price: 38000 },
  { id: 'dado', label: 'Dado tiles', hint: 'Wall tiles between counter and wall cabinets', price: 12000 },
  { id: 'lights', label: 'Under-cabinet lights', hint: 'LED profile lights below the wall cabinets', price: 6500 },
];

// ---- Custom furniture ----

// kind 'area': priced per sq ft of front (width x height, in feet).
// kind 'piece': fixed price per piece, by size.
export const FURNITURE_ITEMS = [
  {
    id: 'wardrobe', label: 'Wardrobe', hint: 'Hinged or sliding, with hanging, shelves and drawers',
    kind: 'area', rate: 1400, width: 6, height: 7, maxWidth: 20, maxHeight: 10,
  },
  {
    id: 'loft', label: 'Loft above wardrobe', hint: 'Top storage up to the ceiling',
    kind: 'area', rate: 950, width: 6, height: 2, maxWidth: 20, maxHeight: 4,
  },
  { id: 'bed', label: 'Storage bed', hint: 'Hydraulic lift-up storage with headboard', kind: 'piece', sizes: [{ id: 'queen', label: 'Queen', price: 46000 }, { id: 'king', label: 'King', price: 56000 }] },
  { id: 'tv', label: 'TV unit', hint: 'Wall panel with base drawers and shelves', kind: 'piece', sizes: [{ id: 's', label: 'Compact', price: 28000 }, { id: 'm', label: 'Standard', price: 45000 }, { id: 'l', label: 'Full wall', price: 72000 }] },
  { id: 'crockery', label: 'Crockery unit', hint: 'Glass shutters with display lighting', kind: 'piece', sizes: [{ id: 's', label: '4 ft', price: 38000 }, { id: 'l', label: '6 ft', price: 54000 }] },
  { id: 'study', label: 'Study table', hint: 'Desk with drawers and an overhead shelf', kind: 'piece', sizes: [{ id: 's', label: '4 ft', price: 22000 }, { id: 'l', label: '6 ft', price: 32000 }] },
  { id: 'dresser', label: 'Dressing unit', hint: 'Mirror with drawers and storage', kind: 'piece', sizes: [{ id: 's', label: 'Standard', price: 21000 }] },
  { id: 'shoe', label: 'Shoe rack', hint: 'Ventilated shutters, seating top', kind: 'piece', sizes: [{ id: 's', label: '3 ft', price: 15000 }, { id: 'l', label: '5 ft', price: 23000 }] },
  { id: 'pooja', label: 'Pooja unit', hint: 'Jaali doors, bell hooks and storage', kind: 'piece', sizes: [{ id: 's', label: 'Wall mounted', price: 18000 }, { id: 'l', label: 'Floor standing', price: 34000 }] },
  { id: 'bookshelf', label: 'Bookshelf', hint: 'Open and closed shelving', kind: 'piece', sizes: [{ id: 's', label: '3 ft', price: 16000 }, { id: 'l', label: '5 ft', price: 26000 }] },
];

// The room the furniture is for (recorded with the lead; does not change price).
export const FURNITURE_ROOMS = [
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'living', label: 'Living room' },
  { id: 'dining', label: 'Dining' },
  { id: 'kids', label: 'Kids room' },
  { id: 'whole', label: 'Whole home' },
];

export const CARPENTRY_TIMING = [
  { id: 'now', label: 'Within a month', hint: 'Ready to start' },
  { id: 'soon', label: 'In 1–3 months', hint: 'Possession or planning' },
  { id: 'exploring', label: 'Just exploring', hint: 'Comparing prices' },
];
