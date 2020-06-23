import * as t from 'io-ts';

export type ErrorType = 'DomainRule' | 'BadInput';

export interface BaseError extends Error {
	__customError__: '__baseError__';
	message: string;
	_raw?: string;
	status?: number;
}

const CommonErrors = t.union([
	t.literal('Different_Currency_Type'),
	t.literal('Invalid_Currency'),
]);
export type CommonErrorsTags = t.TypeOf<typeof CommonErrors>;

interface BrandErrorType<ErrorTypeT extends ErrorType> {
	type: ErrorTypeT;
}
interface BrandErrorTag<ErrorT extends string> {
	tag: ErrorT;
}
export type Err<Tag extends string, U extends ErrorType> = BaseError & BrandErrorType<U> & BrandErrorTag<Tag>;

export const makeErrorValues = <Types extends ErrorType, Tag extends CommonErrorsTags>(
	typ: Types,
	tag: Tag,
) => (message: string, _raw?: string): Err<Tag, Types> => {
	return {
		__customError__: '__baseError__',
		tag,
		type: typ,
		_raw: _raw ? _raw : message,
		name: typ,
		message: message,
	};
};

export const differntCurrenyError = makeErrorValues('DomainRule', 'Different_Currency_Type');

export const invalidCurrencyError = makeErrorValues('BadInput', 'Invalid_Currency');
