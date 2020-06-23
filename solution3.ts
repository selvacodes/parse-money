import { right, left, fold, Either, either, chain } from "fp-ts/lib/Either";
import * as R from "ramda";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe, pipeable } from "fp-ts/lib/pipeable";
const { map } = pipeable(either);

enum CurrencyType {
  $ = "$",
}

enum CurrencyError {
  InvalidCurrencyType = "Invalid Currency Type",
  InvalidCurrencyAmount = "Invalid Currency Amount",
  CurrencyAmount = "Currency amount should be greater than 0",
  NotValidCurrency = "Different Currency Type",
}
type singleCurrency = {
  first: string;
  second: string;
};

const validateBoth = (
  fcurrency: string,
  scurrency: string
): Either<CurrencyError, singleCurrency> => {
  return R.head(fcurrency) == R.head(scurrency)
    ? right({
        first: fcurrency,
        second: scurrency,
      })
    : left(CurrencyError.NotValidCurrency);
};

const validateCurrency = (str: string): Either<string, number> => {
  if (CurrencyType[R.head(str)]) {
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
    validateBoth(firstCurrency, secondCurrency),
    chain((cur: singleCurrency) =>
      sequenceT(either)(
        validateCurrency(cur.first),
        validateCurrency(cur.second)
      )
    ),
    map(([first, second]) => first + second)
  );
};

fold(console.log, (x: number) => console.log(R.concat("$", x.toString())))(
  stringToNumberCurrency("$22.50", "I56.09")
);
