import { handleScientificNotation, uncommify } from 'mint.club-v2-sdk';
import { Pipe, minLength, number, string, transform, union } from 'valibot';

export const stringToNumber = (error: string, pipe?: Pipe<number>) =>
  transform(
    union([string([minLength(1, 'Amount should be provided')]), number()]),
    (val) => {
      const num = Number(uncommify(handleScientificNotation(val)));
      if (isNaN(num) || val === '') {
        return 0;
      }
      return num;
    },
    pipe,
  );
