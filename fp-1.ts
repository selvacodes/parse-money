import { sequenceT } from 'fp-ts/lib/Apply';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import { either } from 'fp-ts/lib/Either';
import { Eq } from 'fp-ts/lib/Eq';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { Semigroup } from 'fp-ts/lib/Semigroup';
import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types/lib/NumberFromString';

const seqtEither = sequenceT(either);

const CurrencyType = t.union([t.literal('$'), t.literal('I'), t.literal('P')]);

const Currency = t.type({
	value: t.number,
	type: CurrencyType,
});

const semigroupCurrency: Semigroup<Currency> = {
	concat: (x, y) => ({
		value: x.value + y.value,
		type: x.type,
	}),
};

const currencyToString = (c: Currency) => `${c.type}${c.value}`;

// const sameCurrency = contramap((curr: Currency) => curr.type)(eqString);

const sameCurrency: Eq<Currency> = {
	equals: (p1, p2) => {
		return p1.type === p2.type;
	},
};
type Currency = t.TypeOf<typeof Currency>;

export function makeCurrency(s: String): O.Option<Currency> {
	const [first, ...rest] = s.split('');

	const x = CurrencyType.decode(first);
	const number = NumberFromString.decode(rest.join(''));
	const seq = pipe(
		seqtEither(x, number),
		E.map(([cu, value]) => ({ value, type: cu })),
		E.chain((x) => Currency.decode(x))
	);

	return O.fromEither(seq);
}

enum CurrencyError {
	DifferentCurrencyType = 'Different Currency Type',
	NotValidCurrency = 'Invalid Currency',
}
const addCurrency = (v1: string, v2: string) => {
	const c1 = makeCurrency(v1);
	const c2 = makeCurrency(v2);
	const parsed = E.fromOption(() => Error(CurrencyError.NotValidCurrency))(A.array.sequence(O.option)([c1, c2]));

	return pipe(
		parsed,
		E.chain(([f, s]) =>
			sameCurrency.equals(f, s)
				? E.right(semigroupCurrency.concat(f, s))
				: E.left(Error(CurrencyError.DifferentCurrencyType))
		),
		E.map(currencyToString)
	);
};

E.fold(console.log, console.log)(addCurrency('$22.09', '$56.09'));
