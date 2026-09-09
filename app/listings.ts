export type DealType = 'Sale' | 'Joint venture';
export type AssetType = 'Bare land' | 'Development property' | 'Income property';

export type Listing = {
  id: number;
  area: string;
  title: string;
  size: string;
  price: string;
  deal: DealType;
  assetType: AssetType;
  notes?: string;
};

// Amounts without an explicitly supplied currency are shown in USD.
export const listings: Listing[] = [
  { id: 1, area: 'Spintex / East Airport', title: 'East Airport land', size: '6 plots', price: '$1.7M', deal: 'Sale', assetType: 'Bare land' },
  { id: 2, area: 'Spintex / East Airport', title: 'Spintex Road land next to SAHS', size: '3.5 plots', price: '$1.4M', deal: 'Sale', assetType: 'Bare land', notes: 'Prime Spintex Road position beside SAHS.' },
  { id: 3, area: 'Spintex / East Airport', title: 'East Airport Filling Station land', size: '1 acre', price: 'Price on request', deal: 'Sale', assetType: 'Bare land', notes: 'Along the main road near the East Airport filling station.' },
  { id: 4, area: 'Spintex / East Airport', title: 'Klagon multi-plot land', size: '6 plots', price: 'GH₵600K / plot', deal: 'Sale', assetType: 'Bare land', notes: 'All six plots must be purchased together.' },
  { id: 5, area: 'Spintex / East Airport', title: 'Klagon land behind Amen Scientific Hospital', size: '1 plot', price: 'GH₵800K', deal: 'Sale', assetType: 'Bare land' },
  { id: 6, area: 'Spintex / East Airport', title: 'Lashibi land next to Ohemaa Mercy', size: '2 plots', price: 'GH₵1.5M', deal: 'Sale', assetType: 'Bare land', notes: 'Price is negotiable.' },

  { id: 7, area: 'Airport Residential / Airport', title: 'Land next to Ministry of Finance', size: '5.5 plots', price: '$3M', deal: 'Sale', assetType: 'Bare land' },
  { id: 8, area: 'Airport Residential / Airport', title: 'Agent Brown land', size: '8.6 acres', price: '$3M / acre', deal: 'Sale', assetType: 'Bare land' },
  { id: 9, area: 'Airport Residential / Airport', title: 'Silver Star joint-venture land', size: '2.5 acres', price: '70 / 30 JV', deal: 'Joint venture', assetType: 'Bare land', notes: 'Joint-venture opportunity around Silver Star.' },
  { id: 10, area: 'Airport Residential / Airport', title: 'Land opposite Airport Shell', size: '1.56 acres', price: '$10M', deal: 'Sale', assetType: 'Bare land' },
  { id: 11, area: 'Airport Residential / Airport', title: 'Land behind Accra Mall', size: 'Almost 3 acres', price: '$6.5M', deal: 'Sale', assetType: 'Bare land' },
  { id: 12, area: 'Airport Residential / Airport', title: 'Land near Best Western Hotel', size: '2.26 acres', price: '$7.5M', deal: 'Sale', assetType: 'Bare land' },
  { id: 13, area: 'Airport Residential / Airport', title: 'Land behind Polo Heights', size: '2 acres', price: '$4M / acre', deal: 'Sale', assetType: 'Bare land' },

  { id: 14, area: 'Cantonments / Labone', title: 'Land near Metro TV', size: '1.25 plots', price: '$900K', deal: 'Sale', assetType: 'Bare land' },
  { id: 15, area: 'Cantonments / Labone', title: 'Land near Bank Hospital', size: '2 plots', price: '$2M', deal: 'Sale', assetType: 'Bare land' },
  { id: 16, area: 'Cantonments / Labone', title: "Susanna's Lodge", size: '2 plots', price: '$1.5M', deal: 'Sale', assetType: 'Development property' },
  { id: 17, area: 'Cantonments / Labone', title: 'Cantonments three-plot land', size: '3 plots', price: '$1.6M', deal: 'Sale', assetType: 'Bare land' },
  { id: 18, area: 'Cantonments / Labone', title: 'Land close to Capitol Restaurant', size: '6 plots', price: '$5M', deal: 'Sale', assetType: 'Bare land', notes: 'Price is negotiable.' },
  { id: 19, area: 'Cantonments / Labone', title: "Land near Vice President's residence", size: '4.5 acres', price: '$17M', deal: 'Sale', assetType: 'Bare land' },
  { id: 20, area: 'Cantonments / Labone', title: "Sebastian's land near Embassy Gardens", size: 'Size on request', price: '$8.5M', deal: 'Sale', assetType: 'Bare land' },
  { id: 21, area: 'Cantonments / Labone', title: 'Ghana Army Mess land opposite 37 Hospital', size: '2 acres', price: '$7.5M', deal: 'Sale', assetType: 'Bare land' },
  { id: 22, area: 'Cantonments / Labone', title: 'Ashton Court Homes JV land', size: '1 acre', price: 'JV terms on request', deal: 'Joint venture', assetType: 'Bare land' },
  { id: 23, area: 'Cantonments / Labone', title: 'Land around Zen Gardens', size: '3 plots', price: '$1.5M', deal: 'Sale', assetType: 'Bare land' },
  { id: 24, area: 'Cantonments / Labone', title: 'Land opposite Lands Commission', size: '1.11 acres', price: '$3.5M', deal: 'Sale', assetType: 'Bare land', notes: 'Located on Giffard Road.' },
  { id: 25, area: 'Cantonments / Labone', title: 'Land behind GIS', size: '1 acre', price: '$5M', deal: 'Sale', assetType: 'Bare land' },

  { id: 26, area: 'East Legon / Adjiringanor', title: 'Furnished apartment complex behind UPSA', size: '20 rooms', price: '$1.2M', deal: 'Sale', assetType: 'Income property', notes: 'Fully furnished apartment complex.' },
  { id: 27, area: 'East Legon / Adjiringanor', title: 'Plots near Galaxy International School', size: 'Per plot', price: '$300K / plot', deal: 'Sale', assetType: 'Bare land' },
  { id: 28, area: 'East Legon / Adjiringanor', title: 'Bare land at 69', size: '5 acres', price: '$180K / plot', deal: 'Sale', assetType: 'Bare land', notes: 'Equivalent asking price: $720K per acre.' },
  { id: 29, area: 'East Legon / Adjiringanor', title: 'Royal Cockpit Hotel, American House', size: '2 plots', price: '$1.5M', deal: 'Sale', assetType: 'Income property' },
  { id: 30, area: 'East Legon / Adjiringanor', title: 'Land behind Bourbon House', size: '1 plot', price: '$450K', deal: 'Sale', assetType: 'Bare land' },
  { id: 31, area: 'East Legon / Adjiringanor', title: 'Djanie-Ashie Road JV land', size: 'Size on request', price: '$200K seed money', deal: 'Joint venture', assetType: 'Bare land', notes: 'Amari Nail Salon is situated on the land. Proposed joint-venture split: 70 / 30.' },
  { id: 32, area: 'East Legon / Adjiringanor', title: 'Adjiringanor multi-plot land', size: '4 plots', price: '$180K / plot', deal: 'Sale', assetType: 'Bare land' },
  { id: 33, area: 'East Legon / Adjiringanor', title: "Kekeli's Arcade", size: '2 plots', price: '$700K', deal: 'Sale', assetType: 'Development property' },
  { id: 34, area: 'East Legon / Adjiringanor', title: 'Grand Casamora property', size: '2 plots', price: '$750K', deal: 'Sale', assetType: 'Development property' },
  { id: 35, area: 'East Legon / Adjiringanor', title: 'Cocoa Street land', size: '1 plot', price: '$350K', deal: 'Sale', assetType: 'Bare land' },
  { id: 36, area: 'East Legon / Adjiringanor', title: 'Ogbojo roadside land', size: '1 acre', price: '$200K / plot', deal: 'Sale', assetType: 'Bare land', notes: 'Roadside position.' },
  { id: 37, area: 'East Legon / Adjiringanor', title: 'Land next to Ideal College', size: '1 acre', price: '$2.5M', deal: 'Sale', assetType: 'Bare land' },
  { id: 38, area: 'East Legon / Adjiringanor', title: 'American House land', size: '1 plot · 75 × 140 ft', price: '$350K', deal: 'Sale', assetType: 'Bare land' },
  { id: 39, area: 'East Legon / Adjiringanor', title: 'Ogbojo inside plots', size: '2 plots', price: '$400K total', deal: 'Sale', assetType: 'Bare land' },
  { id: 40, area: 'East Legon / Adjiringanor', title: "Mr Blankson's house", size: '2 plots', price: '$580K', deal: 'Sale', assetType: 'Development property', notes: 'Indentured property.' },
  { id: 41, area: 'East Legon / Adjiringanor', title: 'Land behind Ideal Homes', size: '2 plots', price: '$650K', deal: 'Sale', assetType: 'Bare land' },
  { id: 42, area: 'East Legon / Adjiringanor', title: 'Land behind MDS Lancet', size: '3 plots', price: '$850K', deal: 'Sale', assetType: 'Bare land' },
  { id: 43, area: 'East Legon / Adjiringanor', title: 'Land close to McDan', size: '3.5 plots', price: '$1M', deal: 'Sale', assetType: 'Bare land', notes: 'Price is negotiable.' },
  { id: 44, area: 'East Legon / Adjiringanor', title: 'Land behind AnC Mall', size: '2 plots', price: '$800K', deal: 'Sale', assetType: 'Bare land' },
  { id: 45, area: 'East Legon / Adjiringanor', title: 'Land opposite AnC Mall / Maxx Mart', size: '2 plots', price: '$750K', deal: 'Sale', assetType: 'Bare land', notes: 'Price is negotiable.' },
  { id: 46, area: 'East Legon / Adjiringanor', title: 'Ghana Canada mansion', size: 'Size on request', price: '$1.4M', deal: 'Sale', assetType: 'Development property' },
  { id: 47, area: 'East Legon / Adjiringanor', title: 'Uncompleted apartment complex near Nova', size: 'Size on request', price: '$800K', deal: 'Sale', assetType: 'Development property', notes: 'Near Nova Fertility & Surgery Center.' },
  { id: 48, area: 'East Legon / Adjiringanor', title: 'Royal Richester land', size: '2 plots', price: '$700K', deal: 'Sale', assetType: 'Bare land' },
  { id: 49, area: 'East Legon / Adjiringanor', title: 'Zylofon Media building', size: 'Size on request', price: '$10M', deal: 'Sale', assetType: 'Development property' },
  { id: 50, area: 'East Legon / Adjiringanor', title: 'Mempeasem land', size: '2.5 plots', price: '$400K', deal: 'Sale', assetType: 'Bare land' },

  { id: 51, area: 'Borteyman', title: 'Borteyman acreage', size: '20 acres', price: '$800K / acre', deal: 'Sale', assetType: 'Bare land' },
  { id: 59, area: 'Borteyman', title: 'Borteyman large-acreage land', size: '50 acres', price: '$100K / plot', deal: 'Sale', assetType: 'Bare land' },
  { id: 52, area: 'Osu', title: 'Land near Oxford Street', size: '1 plot', price: '$500K', deal: 'Sale', assetType: 'Bare land' },
  { id: 53, area: 'Osu', title: 'Land near Parliament House', size: '3.65 acres', price: '$10M', deal: 'Sale', assetType: 'Bare land' },
  { id: 54, area: 'Dzorwulu', title: 'Dzorwulu roadside land', size: '2.4 acres', price: '$5.5M', deal: 'Sale', assetType: 'Bare land', notes: 'Land sits by a tarred road.' },
  { id: 55, area: 'Tse Addo', title: 'Five-storey hospital property', size: '2 plots', price: '$6.5M', deal: 'Sale', assetType: 'Development property' },
  { id: 56, area: 'Sakumono', title: 'Coastal Sakumono acreage', size: '6 acres', price: '$540K / acre', deal: 'Sale', assetType: 'Bare land', notes: 'Approximately five minutes from Junction Mall and close to the sea.' },
  { id: 57, area: 'Awudome', title: 'Awudome land with structure', size: '2.4 acres', price: '$2.5M', deal: 'Sale', assetType: 'Development property' },
  { id: 58, area: 'Accra Central', title: 'Land behind Ecobank Head Office', size: '1.26 acres', price: '$5M', deal: 'Sale', assetType: 'Bare land' },
];

export const areas = Array.from(new Set(listings.map((listing) => listing.area)));
