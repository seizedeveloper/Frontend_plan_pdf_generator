
import { useState } from 'react';
import OfferFlow from '../components/OfferFlow';

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <header className="border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-brand-800">Custom Offer Builder</h1>
          <nav className="flex items-center gap-4">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</button>
            <div className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center text-brand-700 font-medium">
              JD
            </div>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          <OfferFlow />
        </div>
      </main>
    </div>
  );
};

export default Index;
