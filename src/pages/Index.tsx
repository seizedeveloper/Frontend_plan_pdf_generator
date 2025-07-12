
import { useState } from 'react';
import OfferFlow from '../components/OfferFlow';
import UserMenu from "../components/UserMenu"; 

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <header className="border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-brand-800">InstaQuotes</h1>
          <nav className="flex items-center gap-4">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</button>
            <UserMenu />
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
