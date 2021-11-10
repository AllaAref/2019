import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import User from './User';

describe('<User />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<User />);
    const user = getByTestId('User');

    expect(user).toBeInTheDocument();
  });
});