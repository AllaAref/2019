import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Bid from './Bid';

describe('<Bid />', () => {
  test('it should mount', () => {
    render(<Bid />);
    
    const bid = screen.getByTestId('Bid');

    expect(bid).toBeInTheDocument();
  });
});