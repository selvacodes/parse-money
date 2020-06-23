import { Option, none, some } from 'fp-ts/lib/Option'

export interface CurrencyBrand {
	readonly Currency: unique symbol; // ensures uniqueness across modules / packages
}

export type Currency = {
	value: Number;
	type: 'USD' | 'EUR';
} & CurrencyBrand;

// runtime check implemented as a custom type guard
function isNonEmptyString(s: string): s is Currency {
  return s.length > 0
}

export function makeNonEmptyString(s: string): Option<Currency> {
  return isNonEmptyString(s) ? some(s) : none
}