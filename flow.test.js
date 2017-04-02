// @flow
import { createSelector, createStructuredSelector } from 'reselect';

const x = createSelector(
  [
    () => 1,
  ],
  (result: 1) => result,
);

// $FlowFixMe
const y : $$selectorExact<{x: 2}> = createStructuredSelector({
  x,
});

