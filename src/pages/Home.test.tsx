import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Home } from './Home';
import { LanguageProvider } from '../context/LanguageContext';
import { SessionProvider } from '../context/SessionContext';

describe('Home Page', () => {
  it('renders trigger button and navigates to session on click', () => {
    const onNavigate = vi.fn();
    render(
      <LanguageProvider>
        <SessionProvider>
          <Home onNavigate={onNavigate} />
        </SessionProvider>
      </LanguageProvider>
    );

    const triggerButton = screen.getByRole('button', { name: /Get Help Now/i });
    expect(triggerButton).toBeInTheDocument();

    fireEvent.click(triggerButton);
    expect(onNavigate).toHaveBeenCalledWith('session');
  });

  it('renders caregiver and memory mode buttons', () => {
    const onNavigate = vi.fn();
    render(
      <LanguageProvider>
        <SessionProvider>
          <Home onNavigate={onNavigate} />
        </SessionProvider>
      </LanguageProvider>
    );

    const caregiverButton = screen.getByRole('button', { name: /Caregiver Mode/i });
    expect(caregiverButton).toBeInTheDocument();
    
    fireEvent.click(caregiverButton);
    expect(onNavigate).toHaveBeenCalledWith('caregiver');
  });
});
