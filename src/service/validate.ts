import * as R from 'ramda';
import * as validator from 'validator';

import { validate } from '../route/middle/check';
import { ErrorParamsError } from './error';
import validatorPatch from './validate-patch';

validatorPatch(validator);

export function validateRequest(carrier, filed, rules) {
  const value = carrier[filed];
  R.unless(
    rules =>
      rules.every(rule => {
        const [ruleFnName, params] = R.splitAt(1, rule.split(':'));
        return validator[ruleFnName].apply(null, params).call(null, value);
      }),
    () => {
      throw new ErrorParamsError('error params');
    }
  )(rules);
}
