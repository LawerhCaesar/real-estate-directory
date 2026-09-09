import type { AssetType, DealType } from '../app/listings';

export type ListingInput = {
  area: string;
  title: string;
  size: string;
  price: string;
  deal: DealType;
  assetType: AssetType;
  notes?: string;
};

const dealTypes: DealType[] = ['Sale', 'Joint venture'];
const assetTypes: AssetType[] = ['Bare land', 'Development property', 'Income property'];

export function parseListingInput(value: unknown): ListingInput | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Record<string, unknown>;
  const area = typeof input.area === 'string' ? input.area.trim() : '';
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const size = typeof input.size === 'string' ? input.size.trim() : '';
  const price = typeof input.price === 'string' ? input.price.trim() : '';
  const notes = typeof input.notes === 'string' ? input.notes.trim() : '';

  if (!area || !title || !size || !price) return null;
  if (!dealTypes.includes(input.deal as DealType)) return null;
  if (!assetTypes.includes(input.assetType as AssetType)) return null;

  return {
    area,
    title,
    size,
    price,
    deal: input.deal as DealType,
    assetType: input.assetType as AssetType,
    ...(notes ? { notes } : {}),
  };
}
