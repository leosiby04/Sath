import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Emergency } from './Emergency';
import { LanguageProvider } from '../context/LanguageContext';

describe('Emergency Page', () => {
  it('renders emergency hotline and back button', () => {
    const onBack = vi.fn();
    render(
      <LanguageProvider>
        <Emergency onBack={onBack} />
      </LanguageProvider>
    );

    const callLink = screen.getByRole('link', { name: /CALL/i });
    expect(callLink).toBeInTheDocument();
    expect(callLink).toHaveAttribute('href', 'tel:911');

    const backButton = screen.getByRole('button', { name: /return to session/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });
});
