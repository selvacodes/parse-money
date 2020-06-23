import { right, left, fold, Either, either } from "fp-ts/lib/Either";
import * as R from "ramda";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe, pipeable } from "fp-ts/lib/pipeable";
import * as t from 'io-ts'
const { map } = pipeable(either);

enum CurrencyError {
  InvalidCurrencyType = "Invalid Currency Type",
  InvalidCurrencyAmount = "Invalid Currency Amount",
  CurrencyAmount = "Currency amount should be greater than 0",
}

const validateCurrency = (str: string): Either<string, number> => {
  if (R.head(str) == "$") {
    if (R.drop(1, str)) {
      if (parseFloat(R.drop(1, str))) {
        return right(parseFloat(R.drop(1, str)));
      }
      return left(R.concat(str, R.concat(" ", CurrencyError.CurrencyAmount)));
    }
    return left(
      R.concat(str, R.concat(" ", CurrencyError.InvalidCurrencyAmount))
    );
  }
  return left(R.concat(str, R.concat(" ", CurrencyError.InvalidCurrencyType)));
};

const stringToNumberCurrency = (
  firstCurrency: string,
  secondCurrency: string
): Either<string, number> => {
  return pipe(
    sequenceT(either)(
      validateCurrency(firstCurrency),
      validateCurrency(secondCurrency)
    ),
    map(([first, second]) => first + second)
  );
};

fold(console.log, (x: number) => console.log(R.concat("$", x.toString())))(
  stringToNumberCurrency("$22.50", "$33.75")
);

const v1 = "$22.50"
const v2 = "$33.75"

// represents a Date from an ISO string
