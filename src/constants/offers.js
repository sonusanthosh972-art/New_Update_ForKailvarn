// Fixed links used by the advertisement and painting pages. The offer itself
// (on/off, discount, title, dates, text) is edited in Admin -> Advertisement
// and read with usePromo() from src/components/offers/PromoProvider.jsx.
export const DIWALI_OFFER = {
  quotePath: '/painting-quote',
  visualizerPath: '/paint-visualizer',
  consultationPath: '/paint-consultation',
};

// Hero photo, pre-sized from kailvarn-site/assets/img/Luxury Diwali Living Room Glow.png
export const DIWALI_HERO_IMAGE = {
  src: '/offers/diwali-living-room-1600.jpg',
  srcSet: '/offers/diwali-living-room-768.webp 768w, /offers/diwali-living-room-1280.webp 1280w, /offers/diwali-living-room-1920.webp 1920w',
};

// Painting quote wizard choices. `label` is what the team sees on the lead.
// `sqft` = carpet area the quote starts from; the visitor can correct it.
export const PAINT_HOMES = [
  { id: '1bhk', label: '1 BHK', hint: 'Up to ~600 sq ft', sqft: 600 },
  { id: '2bhk', label: '2 BHK', hint: '~750–1,000 sq ft', sqft: 1000 },
  { id: '3bhk', label: '3 BHK', hint: '~1,100–1,400 sq ft', sqft: 1400 },
  { id: '4bhk', label: '4 BHK+', hint: '~1,500 sq ft and above', sqft: 1500 },
  { id: 'villa', label: 'Villa / Bungalow', hint: 'Independent house', sqft: 2000 },
  { id: 'shop', label: 'Shop / Office', hint: 'Commercial space', sqft: 500 },
];
export const PAINT_SCOPES = [
  { id: 'interior', label: 'Interior walls', hint: 'Rooms, halls & passages' },
  { id: 'exterior', label: 'Exterior walls', hint: 'Outside walls & balcony' },
  { id: 'both', label: 'Interior + Exterior', hint: 'Complete home painting' },
];
// Painting quote: brand (step 3) -> that brand's range (step 4).
// tier: 'luxury' | 'premium' | 'mid' | 'economy' | 'decorative' | 'specialty'
export const PAINT_TIERS = {
  luxury: 'Luxury',
  premium: 'Premium',
  mid: 'Mid-range',
  economy: 'Economy',
  decorative: 'Designer / Textures',
  specialty: 'Specialty',
};

// Popular wall shades shown on the range step, by tier, so families can picture
// the finish on their own walls. Indicative colours only; the exact shade code
// is picked from the brand's shade card at the site visit. A range can override
// these with its own `shades`.
export const PAINT_TIER_SHADES = {
  luxury: [
    { name: 'Royal Emerald', code: 'LX-01', hex: '#1F5C4A' },
    { name: 'Midnight Navy', code: 'LX-02', hex: '#1E2A44' },
    { name: 'Terracotta', code: 'LX-03', hex: '#B5603F' },
    { name: 'Champagne Gold', code: 'LX-04', hex: '#D8C29A' },
    { name: 'Dusty Rose', code: 'LX-05', hex: '#C99A92' },
  ],
  premium: [
    { name: 'Sage Green', code: 'PR-01', hex: '#A8B89A' },
    { name: 'Powder Blue', code: 'PR-02', hex: '#B9CCD8' },
    { name: 'Warm Beige', code: 'PR-03', hex: '#E3D3BC' },
    { name: 'Soft Peach', code: 'PR-04', hex: '#F1C9AE' },
    { name: 'Lavender Mist', code: 'PR-05', hex: '#C9C0D9' },
  ],
  mid: [
    { name: 'Light Sand', code: 'MD-01', hex: '#E9DCC4' },
    { name: 'Mint Fresh', code: 'MD-02', hex: '#CFE3D3' },
    { name: 'Lemon Cream', code: 'MD-03', hex: '#F3E6B0' },
    { name: 'Pearl Grey', code: 'MD-04', hex: '#D6D4CE' },
    { name: 'Blush Pink', code: 'MD-05', hex: '#EFD3CF' },
  ],
  economy: [
    { name: 'Classic Off-White', code: 'EC-01', hex: '#F3EFE6' },
    { name: 'Ivory', code: 'EC-02', hex: '#F2EAD3' },
    { name: 'Sky Blue', code: 'EC-03', hex: '#CFE0EA' },
    { name: 'Light Lemon', code: 'EC-04', hex: '#F4EBC2' },
    { name: 'Pista Green', code: 'EC-05', hex: '#D7E4C4' },
  ],
  decorative: [
    { name: 'Metallic Gold', code: 'DC-01', hex: '#B8964F' },
    { name: 'Stone Grey', code: 'DC-02', hex: '#8E8A82' },
    { name: 'Copper Glow', code: 'DC-03', hex: '#A8623E' },
    { name: 'Concrete', code: 'DC-04', hex: '#A6A39C' },
    { name: 'Deep Teal', code: 'DC-05', hex: '#24575A' },
  ],
  specialty: [
    { name: 'Calm White', code: 'SP-01', hex: '#F1F0EB' },
    { name: 'Eucalyptus', code: 'SP-02', hex: '#B7C7B4' },
    { name: 'Morning Blue', code: 'SP-03', hex: '#C8D6DE' },
    { name: 'Oat', code: 'SP-04', hex: '#E2D6C2' },
    { name: 'Soft Clay', code: 'SP-05', hex: '#D9B9A3' },
  ],
};

// Last option on every brand's range step.
export const PAINT_RANGE_HELP = { id: 'help', label: 'Help me choose', tier: '', examples: 'Our expert suggests the right range for your walls and budget at the site visit.' };

// `rate` = our price per sq ft of carpet area (paint + labour). Internal only:
// the wizard multiplies it by the home's area and shows just the total, never
// the rate itself. `exterior: true` marks outside-wall paints.
export const PAINT_BRANDS = [
  {
    id: 'asian-paints',
    label: 'Asian Paints',
    ranges: [
      {
        id: 'royale',
        label: 'Royale',
        tier: 'luxury',
        rate: 105,
        examples: 'Royale Luxury Emulsion, Royale Shyne, Royale Matt, Royale Aspira',
        shades: [
          { name: 'Brilliant White', code: 'L101', hex: '#FFFFFF' },
          { name: 'Deep Sea Blue', code: '9159', hex: '#1F314F' },
          { name: 'Classic Ivory', code: '0315', hex: '#F4F0EC' },
          { name: 'Sea Nymph', code: '7562', hex: '#B3DACB' },
          { name: 'Twilight Zone', code: '7325', hex: '#335492' },
        ],
      },
      {
        id: 'apcolite',
        label: 'Apcolite',
        tier: 'premium',
        rate: 80,
        examples: 'Apcolite Premium Emulsion, Apcolite Advanced Shyne, Apcolite Satin',
        shades: [
          { name: 'Morning Glory', code: '0414', hex: '#F7F5EE' },
          { name: 'Blue Fragrance', code: '9191', hex: '#6498D2' },
          { name: 'Earthy Green', code: '9319', hex: '#7DA27E' },
          { name: 'Blushing Rose', code: '5117', hex: '#E3B8A6' },
          { name: 'Soft Chiffon', code: '7931', hex: '#EBDCC6' },
        ],
      },
      {
        id: 'tractor',
        label: 'Tractor',
        tier: 'economy',
        rate: 70,
        examples: 'Tractor Emulsion, Tractor Sparc, Tractor Shyne',
        shades: [
          { name: 'Classic Off-White', code: '0212', hex: '#F3EFE6' },
          { name: 'Butter Cream', code: 'L504', hex: '#FFFDD0' },
          { name: 'Sky Blue', code: '0178', hex: '#CFE0EA' },
          { name: 'Pista Green', code: '7721', hex: '#D7E4C4' },
          { name: 'Light Peach', code: '5092', hex: '#F8DFC8' },
        ],
      },
    ],
  },
  {
    id: 'berger',
    label: 'Berger',
    ranges: [
      {
        id: 'silk-glamour',
        label: 'Silk Glamour',
        tier: 'luxury',
        rate: 108,
        examples: 'Silk Glamor High Sheen, Silk Glamor Soft Sheen, Silk Glamor Matt',
        shades: [
          { name: 'Amorous', code: '1P 8568', hex: '#8C4A58' },
          { name: 'Meandering Garden', code: '4T 0941', hex: '#4A5D4E' },
          { name: 'Baby Blush', code: '1D 8566', hex: '#EFC1B8' },
          { name: 'Cool Shadow', code: '8D 1815', hex: '#D0D3D4' },
          { name: 'Royal Crest', code: '3D 0256', hex: '#D4AF37' },
        ],
      },
      {
        id: 'weathercoat',
        label: 'WeatherCoat',
        tier: 'premium',
        exterior: true,
        rate: 92,
        examples: 'WeatherCoat All Guard, WeatherCoat Anti Dustt, WeatherCoat Long Life',
      },
      {
        id: 'silk',
        label: 'Silk',
        tier: 'premium',
        rate: 84,
        examples: 'Silk Luxury Emulsion, Silk Breathe Easy',
      },
      {
        id: 'easy-clean',
        label: 'Easy Clean',
        tier: 'mid',
        rate: 76,
        examples: 'Easy Clean, Easy Clean Fresh, Easy Clean Silky Touch',
        shades: [
          { name: 'Pure White', code: '8P 0201', hex: '#F4F5F7' },
          { name: 'Vanilla Latte', code: '2T 0602', hex: '#D5BCA6' },
          { name: 'Barbie Pink', code: '1D 0512', hex: '#F39AC9' },
          { name: 'Frosty Mint', code: '4P 0113', hex: '#D2EBD4' },
          { name: 'Silver Shadows', code: '8T 1714', hex: '#B8BEC1' },
        ],
      },
      {
        id: 'bison',
        label: 'Bison',
        tier: 'economy',
        rate: 69,
        examples: 'Bison Emulsion, Bison Glow, Bison Lite',
        shades: [
          { name: 'Bison Off-White', code: '8P 0001', hex: '#F6F4EB' },
          { name: 'Pale Ivory', code: '2P 0012', hex: '#F2E9D0' },
          { name: 'Ocean Breeze', code: '5P 0134', hex: '#D0E5EE' },
          { name: 'Sunny Glow', code: '3T 0783', hex: '#F9ECC4' },
          { name: 'Soft Willow', code: '4P 0081', hex: '#DCE6D2' },
        ],
      },
    ],
  },
  {
    id: 'nerolac',
    label: 'Nerolac',
    ranges: [
      {
        id: 'excel-total',
        label: 'Excel Total',
        tier: 'luxury',
        exterior: true,
        rate: 106,
        examples: 'Excel Total all-in-one exterior emulsion',
      },
      {
        id: 'impressions',
        label: 'Impressions',
        tier: 'luxury',
        rate: 92,
        examples: 'Impressions Ultra HD, Impressions HD, Impressions Sheen, Impressions Ultra Fresh',
        shades: [
          { name: 'Ra Gold', code: '2042', hex: '#DAA33F' },
          { name: 'Cobalt Night', code: 'NP217', hex: '#0047AB' },
          { name: 'Crystal White', code: 'W-101', hex: '#F9F9F9' },
          { name: 'Olivero Gold', code: '4008', hex: '#CAAB52' },
          { name: 'Blush Rose', code: 'NP116', hex: '#F9C2CF' },
        ],
      },
      {
        id: 'suraksha',
        label: 'Suraksha',
        tier: 'premium',
        exterior: true,
        rate: 82,
        examples: 'Suraksha, Suraksha Plus exterior emulsion',
      },
      {
        id: 'excel',
        label: 'Excel',
        tier: 'mid',
        exterior: true,
        rate: 76,
        examples: 'Excel Anti Peel, Excel Mica Marble exterior emulsion',
      },
      {
        id: 'beauty',
        label: 'Beauty',
        tier: 'economy',
        rate: 68,
        examples: 'Beauty Gold, Beauty Sheen, Beauty Smooth',
        shades: [
          { name: 'Butter Yellow', code: 'NP404', hex: '#FFFDD0' },
          { name: 'Clear Blue Sky', code: '4901', hex: '#87CEEB' },
          { name: 'Cotton Soft', code: 'NP007', hex: '#FFF5EE' },
          { name: 'Mineral Water', code: '2577', hex: '#E0F8F7' },
          { name: 'Baby Pink', code: 'NP109', hex: '#FFB6C1' },
        ],
      },
    ],
  },
  {
    id: 'dulux',
    label: 'Dulux',
    ranges: [
      {
        id: 'velvet-touch-diamond',
        label: 'Velvet Touch Diamond',
        tier: 'luxury',
        rate: 108,
        examples: 'Velvet Touch Diamond Glo',
        shades: [
          { name: 'Tusk Tusk', code: '30YY 79/070', hex: '#ECE2D2' },
          { name: 'Rich Burgundy', code: '10RR 13/371', hex: '#621D27' },
          { name: 'Deep Sapphire', code: '30BB 10/112', hex: '#182B49' },
          { name: 'Natural Calico', code: '10YY 72/080', hex: '#E5DCC9' },
          { name: 'Emerald Jewel', code: '90GG 19/151', hex: '#245848' },
        ],
      },
      {
        id: 'ambiance',
        label: 'Ambiance',
        tier: 'decorative',
        rate: 102,
        examples: 'Ambiance special-effect and designer finishes',
      },
      {
        id: 'weathershield',
        label: 'Weathershield',
        tier: 'premium',
        exterior: true,
        rate: 94,
        examples: 'Weathershield Max, Weathershield Powerflexx exterior emulsion',
      },
      {
        id: 'velvet-touch',
        label: 'Velvet Touch',
        tier: 'premium',
        rate: 86,
        examples: 'Velvet Touch Pearl Glo, Platinum Glo',
      },
      {
        id: 'supercover',
        label: 'SuperCover',
        tier: 'mid',
        rate: 78,
        examples: 'SuperCover, SuperCover Ultra',
        shades: [
          { name: 'Warm Barley', code: '20YY 68/102', hex: '#E8DFCB' },
          { name: 'Morning Frost', code: '50GY 83/040', hex: '#E4EAE1' },
          { name: 'Pale Dove Grey', code: '50BG 64/028', hex: '#CCD3D6' },
          { name: 'Sunburst Yellow', code: '40YY 73/344', hex: '#F6E294' },
          { name: 'Meadow Grass', code: '10GY 58/278', hex: '#ADC49F' },
        ],
      },
      {
        id: 'promise',
        label: 'Promise',
        tier: 'economy',
        rate: 72,
        examples: 'Promise Interior, Promise Sheen Interior, Promise SmartChoice',
        shades: [
          { name: 'Brilliant Off-White', code: '00NN 83/000', hex: '#F3F1EC' },
          { name: 'Sunlight Ivory', code: '35YY 81/174', hex: '#F4EBCF' },
          { name: 'Coastal Breeze', code: '70BG 68/056', hex: '#D4E1E5' },
          { name: 'Rose Quartz', code: '50RR 74/090', hex: '#F5DBDE' },
          { name: 'Pista Tint', code: '50YY 77/285', hex: '#DFE8BE' },
        ],
      },
    ],
  },
  {
    id: 'nippon',
    label: 'Nippon Paint',
    ranges: [
      {
        id: 'satin-glo-premium',
        label: 'Satin Glo Premium',
        tier: 'luxury',
        rate: 106,
        examples: 'Satin Glo Premium luxury emulsion',
        shades: [
          { name: 'Pebble Walk', code: 'NP N 1817 P', hex: '#D2C8AD' },
          { name: 'Old Box Charcoal', code: 'NP N 1820 A', hex: '#B8AD99' },
          { name: 'Favorite Shawl', code: 'NP N 1903 T', hex: '#C9B29B' },
          { name: 'Smoking Gray', code: 'NP N 2045 T', hex: '#A3A7A8' },
          { name: 'Satin Royal Blue', code: 'NP PB 1530 D', hex: '#234374' },
        ],
      },
      {
        id: 'momento',
        label: 'Momento',
        tier: 'decorative',
        rate: 98,
        examples: 'Momento designer and special-effect finishes',
      },
      {
        id: 'odourless',
        label: 'Odour-less',
        tier: 'premium',
        rate: 92,
        examples: 'Odour-less low-smell premium emulsion',
        shades: [
          { name: 'Odour-less Pure White', code: 'OW 01', hex: '#FBFBF9' },
          { name: 'Sanded Birch', code: 'NP N 1818 P', hex: '#D4CBB0' },
          { name: 'Zen Green', code: 'NP BGG 1605 T', hex: '#A8BAA5' },
          { name: 'Serene Sky', code: 'NP PB 1478 T', hex: '#B8CBD8' },
          { name: 'Gentle Fawn', code: 'NP N 1845 P', hex: '#DED2BE' },
        ],
      },
      {
        id: 'weatherbond',
        label: 'Weatherbond',
        tier: 'premium',
        exterior: true,
        rate: 88,
        examples: 'Weatherbond, Weatherbond Advance exterior emulsion',
      },
      {
        id: 'satin-glo',
        label: 'Satin Glo',
        tier: 'premium',
        rate: 82,
        examples: 'Satin Glo, Satin Glo+',
      },
      {
        id: 'spotless',
        label: 'Spot-less',
        tier: 'mid',
        rate: 75,
        examples: 'Spot-less NXT anti-stain washability',
        shades: [
          { name: 'Spotless Pure White', code: 'NP OW 1081 P', hex: '#F7F7F5' },
          { name: 'Absolute Yellow', code: 'NP YO 1113 P', hex: '#F4E298' },
          { name: 'Rose Fragrance', code: 'NP R 1272 P', hex: '#F5D3D6' },
          { name: 'Mint Frost', code: 'NP BGG 1672 P', hex: '#CEE5DB' },
          { name: 'Soft Denim', code: 'NP PB 1494 T', hex: '#7B9FB9' },
        ],
      },
      {
        id: 'matex',
        label: 'Matex',
        tier: 'economy',
        rate: 68,
        examples: 'Matex Gold, Matex EZ Wash',
        shades: [
          { name: 'Matex White', code: 'NP OW 1001 P', hex: '#F5F5EE' },
          { name: 'Golden Harvest', code: 'NP YO 1152 T', hex: '#EED18D' },
          { name: 'Misty Morning', code: 'NP N 2002 P', hex: '#D6DADB' },
          { name: 'Apple Orchard', code: 'NP BGG 1634 P', hex: '#CCE0C4' },
          { name: 'Desert Sand', code: 'NP N 1863 T', hex: '#DBC4A7' },
        ],
      },
    ],
  },
  {
    id: 'birla-opus',
    label: 'Birla Opus',
    ranges: [
      {
        id: 'style',
        label: 'Style',
        tier: 'luxury',
        rate: 101,
        examples: 'Style Color Smart, Style Super Bright, Style Super Smooth',
      },
      {
        id: 'safe',
        label: 'Safe',
        tier: 'premium',
        rate: 81,
        examples: 'Safe low-VOC interior emulsion',
      },
      {
        id: 'one',
        label: 'One',
        tier: 'mid',
        rate: 74,
        examples: 'One Pure Elegance, One Pure Elegance Shine, One Pure Elegance Matt',
      },
      {
        id: 'ezycoat',
        label: 'Ezycoat',
        tier: 'economy',
        rate: 67,
        examples: 'Ezycoat interior emulsion',
      },
    ],
  },
  {
    // Undecided: choose by budget instead of a brand's range names. These
    // have no single rate; the quote shows the span of that tier's brand rates.
    id: 'suggest',
    label: 'Not sure, suggest the best',
    ranges: [
      {
        id: 'luxury',
        label: 'Luxury finish',
        tier: 'luxury',
        examples: 'Richest colour and sheen, longest life (e.g. Royale, Silk Glamour, Impressions, Velvet Touch Diamond)',
        shades: [
          { name: 'Asian Paints Deep Sea', code: '9159', hex: '#1F314F' },
          { name: 'Berger Silk Amorous', code: '1P 8568', hex: '#8C4A58' },
          { name: 'Dulux Velvet Tusk Tusk', code: '30YY 79/070', hex: '#ECE2D2' },
          { name: 'Nerolac Impressions Gold', code: '2042', hex: '#DAA33F' },
          { name: 'Nippon Satin Royal Blue', code: 'NP PB 1530 D', hex: '#234374' },
        ],
      },
      {
        id: 'premium',
        label: 'Premium washable',
        tier: 'premium',
        examples: 'Wipe off stains and crayon marks, family favourite (e.g. Apcolite, Silk, Velvet Touch, Satin Glo)',
        shades: [
          { name: 'Apcolite Blue Fragrance', code: '9191', hex: '#6498D2' },
          { name: 'Apcolite Earthy Green', code: '9319', hex: '#7DA27E' },
          { name: 'Nippon Zen Green', code: 'NP BGG 1605 T', hex: '#A8BAA5' },
          { name: 'Nippon Serene Sky', code: 'NP PB 1478 T', hex: '#B8CBD8' },
          { name: 'Apcolite Soft Chiffon', code: '7931', hex: '#EBDCC6' },
        ],
      },
      {
        id: 'mid',
        label: 'Mid-range',
        tier: 'mid',
        examples: 'Good finish at a fair price (e.g. Easy Clean, SuperCover, Spot-less)',
        shades: [
          { name: 'Berger Vanilla Latte', code: '2T 0602', hex: '#D5BCA6' },
          { name: 'Dulux Meadow Grass', code: '10GY 58/278', hex: '#ADC49F' },
          { name: 'Nippon Absolute Yellow', code: 'NP YO 1113 P', hex: '#F4E298' },
          { name: 'Dulux Pale Dove Grey', code: '50BG 64/028', hex: '#CCD3D6' },
          { name: 'Berger Frosty Mint', code: '4P 0113', hex: '#D2EBD4' },
        ],
      },
      {
        id: 'economy',
        label: 'Budget-friendly',
        tier: 'economy',
        examples: 'Fresh, clean look for less (e.g. Tractor, Bison, Promise, Matex)',
        shades: [
          { name: 'Tractor Butter Cream', code: 'L504', hex: '#FFFDD0' },
          { name: 'Bison Pale Ivory', code: '2P 0012', hex: '#F2E9D0' },
          { name: 'Dulux Coastal Breeze', code: '70BG 68/056', hex: '#D4E1E5' },
          { name: 'Nerolac Clear Blue Sky', code: '4901', hex: '#87CEEB' },
          { name: 'Nippon Apple Orchard', code: 'NP BGG 1634 P', hex: '#CCE0C4' },
        ],
      },
    ],
  },
];

// Grills & door frames step: enamel paint, priced per piece (shown to the user).
export const PAINT_METAL_WORK = [
  { id: 'doorFrames', label: 'Door frames', hint: 'Enamel on main & room door frames', price: 1000 },
  { id: 'grills', label: 'Window grills', hint: 'Rust-proof enamel on window grills', price: 1500 },
];

export const PAINT_EXTRAS = [
  { id: 'damp', label: 'Damp & seepage treatment', hint: 'Damp patches, peeling or salt marks' },
  { id: 'putty', label: 'Wall putty & crack repair', hint: 'Smooth walls before painting' },
  { id: 'texture', label: 'Texture / accent wall', hint: 'A statement wall in living or pooja room' },
  { id: 'wood', label: 'Wood polish', hint: 'Polish for wooden doors & furniture' },
  { id: 'terrace', label: 'Terrace waterproofing', hint: 'Stop leaks before the monsoon' },
];
export const PAINT_TIMING = [
  { id: 'diwali', label: 'Before the festival', hint: 'Limited festive slots' },
  { id: 'month', label: 'Within a month', hint: 'Flexible dates' },
  { id: 'exploring', label: 'Just checking prices', hint: 'Planning ahead' },
];
