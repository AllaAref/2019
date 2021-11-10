import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ItemDetailed from './ItemDetailed';

describe('<ItemDetailed />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<ItemDetailed />);
    const itemDetailed = getByTestId('ItemDetailed');

    expect(itemDetailed).toBeInTheDocument();
  });
});