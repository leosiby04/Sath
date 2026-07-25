import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageSelector } from './LanguageSelector';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

const TestComponent = () => {
  const { language } = useLanguage();
  return (
    <div>
      <LanguageSelector />
      <div data-testid="current-lang">{language}</div>
    </div>
  );
};

describe('LanguageSelector', () => {
  it('changes language in context when selection changes', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');

    const select = screen.getByRole('combobox', { name: 'Select Language' });
    fireEvent.change(select, { target: { value: 'hi' } });

    expect(screen.getByTestId('current-lang')).toHaveTextContent('hi');
  });
});
