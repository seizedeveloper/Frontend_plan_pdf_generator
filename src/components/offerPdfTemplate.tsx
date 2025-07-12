import React, { useRef } from 'react';
import { Product } from '../types';

interface OfferPdfTemplateProps {
  products: Product[];
  details: {
    clientName: string;
    clientEmail: string;
    offerName: string;
    expirationDate: Date | null;
    notes: string;
  };
}

const OfferPdfTemplate = React.forwardRef<HTMLDivElement, OfferPdfTemplateProps>(({ products, details }, ref) => {
  const subtotal = products.reduce((acc, p) => acc + (p.modifiedPrice || p.originalPrice) * p.quantity, 0);
  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <div
      ref={ref}
      style={{
        width: '100%', // allow flexibility
    // maxWidth: '800px', // stay within printable page limits
    margin: '0 auto',
    // padding: '20px',
    boxSizing: 'border-box', // ensures padding doesn’t expand width
    fontFamily: 'Arial',
      }}
    >
      {/* Header Section */}
      <div style={{ background: '#000', color: '#fff', padding: '40px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>COMPANY</div>
          <div style={{ fontSize: '28px', color: '#f7931e', fontWeight: 'bold' }}>INVOICE</div>
        </div>
        <div style={{ height: '6px', background: '#f7931e', marginTop: '10px', width: '80px' }}></div>
      </div>

      <div style={{ padding: '40px' }}>
        {/* Invoice Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#f7931e', fontWeight: 'bold' }}>INVOICE TO:</p>
            <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '4px 0' }}>{details.clientName}</p>
            <p>Client Email: {details.clientEmail}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#f7931e', fontWeight: 'bold' }}>Offer Info</p>
            <p>Offer: {details.offerName}</p>
            <p>Expires: {details.expirationDate?.toLocaleDateString() || 'No expiration'}</p>
          </div>
        </div>

        {/* Table */}
        <table style={{width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',}}>
          <thead>
            <tr style={{ background: '#f7931e', color: '#fff' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>ITEM</th>
              <th style={{ padding: '10px' }}>DESCRIPTION</th>
              <th style={{ padding: '10px' }}>PRICE</th>
              <th style={{ padding: '10px' }}>QTY</th>
              <th style={{ padding: '10px' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ background: '#f9f9f9' }}>
                <td style={{ padding: '10px' }}>{p.name}</td>
                <td style={{ padding: '10px' }}>{p.modifiedDescription || p.description}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>${(p.modifiedPrice || p.originalPrice).toFixed(2)}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{p.quantity} {p.unit}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>${((p.modifiedPrice || p.originalPrice) * p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <table style={{ width: '100%', marginTop: '20px', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left', padding: '5px 10px' }}>Subtotal:</td>
              <td style={{ textAlign: 'right', padding: '5px 31px' }}>${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left', padding: '5px 10px' }}>Discount:</td>
              <td style={{ textAlign: 'right', padding: '5px 31px' }}>00.00</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left', padding: '5px 10px' }}>Tax (10%):</td>
              <td style={{ textAlign: 'right', padding: '5px 31px' }}>${taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ paddingTop: '10px' }}>
                <div
                  style={{
                    backgroundColor: '#f7931e',
                    color: 'white',
                    padding: '10px 31px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  Total: ${total.toFixed(2)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        {details.notes && (
          <div style={{ marginTop: '40px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Notes:</p>
            <p style={{ fontSize: '13px', color: '#555' }}>{details.notes}</p>
          </div>
        )}

        {/* Signature */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <img
              src="https://i.ibb.co/ZLkzPj3/signature-placeholder.png"
              alt="Signature"
              style={{ height: '40px' }}
            />
            <div style={{ borderTop: '1px solid #000', marginTop: '5px', fontSize: '13px' }}>
              Your Name & Signature
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Account Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OfferPdfTemplate;
