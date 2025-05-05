
import { useState } from 'react';

interface OfferDetailsProps {
  details: {
    clientName: string;
    clientEmail: string;
    offerName: string;
    expirationDate: Date | null;
    notes: string;
  };
  onDetailsChange: (details: any) => void;
}

const OfferDetails = ({ details, onDetailsChange }: OfferDetailsProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDetailsChange({ [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDetailsChange({ expirationDate: date });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Offer Details</h2>
        <p className="text-muted-foreground">
          Provide information about the client and customize your offer.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="clientName" className="text-sm font-medium">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={details.clientName}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Enter client name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="clientEmail" className="text-sm font-medium">
              Client Email
            </label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              value={details.clientEmail}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Enter client email"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="offerName" className="text-sm font-medium">
              Offer Name
            </label>
            <input
              type="text"
              id="offerName"
              name="offerName"
              value={details.offerName}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="e.g. Q2 2025 Service Package"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="expirationDate" className="text-sm font-medium">
              Expiration Date
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={details.expirationDate ? new Date(details.expirationDate).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={details.notes}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 min-h-[120px]"
            placeholder="Add any additional terms, conditions, or notes for the client..."
          ></textarea>
        </div>

        <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
          <h3 className="font-medium text-brand-800">Tips for a Great Offer</h3>
          <ul className="text-sm text-brand-600 mt-2 space-y-1 list-disc pl-5">
            <li>Be specific about what's included in each product/service</li>
            <li>Include clear terms for payments and delivery</li>
            <li>Add any warranty or guarantee information</li>
            <li>Set a realistic expiration date to create urgency</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
