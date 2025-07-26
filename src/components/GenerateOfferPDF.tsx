import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Product } from '../types';

interface OfferDetails {
  clientName: string;
  clientEmail: string;
  offerName: string;
  expirationDate: Date | null;
  notes: string;
  discount: number;
  tax: number;
}

export function generateOfferPdf(
  products: Product[],
  details: OfferDetails
) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  const margin = 10;
  let y = margin;

  // Header
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('Company Name', margin, 20);

  doc.setFontSize(28);
  doc.setTextColor(247, 147, 30);
  doc.text('INVOICE', pageWidth - margin - 50, 20);

  // Orange underline
  doc.setDrawColor(247, 147, 30);
  doc.setLineWidth(2);
  doc.line(margin, 25, margin + 40, 25);

  y = 45;

  // Client Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(247, 147, 30);
  doc.text('INVOICE TO:', margin, y);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`${details.clientName}`, margin, y + 6);
  doc.text(`Client Email: ${details.clientEmail}`, margin, y + 12);

  // Offer Info
  doc.setFont(undefined, 'bold');
  doc.setTextColor(247, 147, 30);
  doc.text('Offer Info:', pageWidth - margin - 50, y);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Offer: ${details.offerName}`, pageWidth - margin - 50, y + 6);
  doc.text(
    `Expires: ${details.expirationDate?.toLocaleDateString() || 'No expiration'}`,
    pageWidth - margin - 50,
    y + 12
  );

  y += 25;

  // Table
  const tableData = products.map((p) => [
    p.name,
    p.modifiedDescription || p.description,
    `€${(p.modifiedPrice || p.originalPrice).toFixed(2)}`,
    `${p.quantity} ${p.unit || ''}`,
    `€${((p.modifiedPrice || p.originalPrice) * p.quantity).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: y,
    margin: {left: margin},
    head: [['ITEM', 'DESCRIPTION', 'PRICE', 'QTY', 'TOTAL']],
    body: tableData,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [247, 147, 30],
      textColor: 255,
    },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totals
  const subtotal = products.reduce(
    (acc, p) => acc + (p.modifiedPrice || p.originalPrice) * p.quantity,
    0
  );
  const discounted = subtotal - (subtotal * details.discount) / 100;
  const taxed = discounted + (discounted * details.tax) / 100;

  const totals = [
    ['Subtotal:', `€${subtotal.toFixed(2)}`],
    [`Discount (${details.discount}%):`, `-€${(subtotal * details.discount / 100).toFixed(2)}`],
    [`Tax (${details.tax}%):`, `€${((discounted * details.tax) / 100).toFixed(2)}`],
    ['Total:', `€${taxed.toFixed(2)}`],
  ];

  totals.forEach(([label, value], i) => {
    doc.setFont(undefined, i === 3 ? 'bold' : 'normal');
    doc.setFontSize(i === 3 ? 12 : 10);
    doc.text(label, pageWidth - margin - 50, finalY + i * 6);
    doc.text(value, pageWidth - margin - 10, finalY + i * 6, { align: 'right' });
  });

  finalY += totals.length * 6 + 10;

  // Notes
  if (details.notes) {
    doc.setFont(undefined, 'bold');
    doc.text('Notes:', margin, finalY);
    doc.setFont(undefined, 'normal');
    const wrappedText = doc.splitTextToSize(details.notes, pageWidth - margin * 2);
    doc.text(wrappedText, margin, finalY + 6);
    finalY += wrappedText.length * 5 + 10;
  }

  // Signature
  doc.setFontSize(10);
  doc.text('Your Name & Signature', pageWidth - margin - 30, finalY + 30, { align: 'center' });
  doc.text('Account Manager', pageWidth - margin - 30, finalY + 36, { align: 'center' });

  doc.save(`${details.offerName || 'Offer'}.pdf`);
}

// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { Product } from '../types';

// interface OfferDetails {
//   clientName: string;
//   clientEmail: string;
//   offerName: string;
//   expirationDate: Date | null;
//   notes: string;
//   discount: number;
//   tax: number;
// }

// export function generateOfferPdf(
//   products: Product[],
//   details: OfferDetails,
//   headerTitle: string = 'COMPANY',
//   subHeaderTitle: string = 'INVOICE'
// ) {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const margin = 10;
//   let y = margin;

//   // Header background bar
//   doc.setFillColor(0, 0, 0);
//   doc.rect(0, 0, pageWidth, 30, 'F');

//   // Header Title (left side)
//   doc.setFontSize(20);
//   doc.setTextColor(255, 255, 255);
//   doc.setFont(undefined, 'bold');
//   doc.text(headerTitle, margin, 20);

//   // Sub Header Title (right side)
//   doc.setFontSize(28);
//   doc.setTextColor(247, 147, 30);
//   doc.setFont(undefined, 'bold');
//   doc.text(subHeaderTitle, pageWidth - margin - 50, 20);

//   // Orange underline
//   doc.setDrawColor(247, 147, 30);
//   doc.setLineWidth(2);
//   doc.line(margin, 23, margin + 40, 23);

//   y = 45;

//   // Client Info
//   doc.setTextColor(247, 147, 30);
//   doc.setFontSize(12);
//   doc.setFont(undefined, 'bold');
//   doc.text('INVOICE TO:', margin, y);
//   doc.setFont(undefined, 'normal');
//   doc.setTextColor(0, 0, 0);
//   doc.text(`${details.clientName}`, margin, y + 6);
//   doc.text(`Client Email: ${details.clientEmail}`, margin, y + 12);

//   // Offer Info
//   doc.setFont(undefined, 'bold');
//   doc.setTextColor(247, 147, 30);
//   doc.text('Offer Info:', pageWidth - margin - 50, y);
//   doc.setFont(undefined, 'normal');
//   doc.setTextColor(0, 0, 0);
//   doc.text(`Offer: ${details.offerName}`, pageWidth - margin - 50, y + 6);
//   doc.text(
//     `Expires: ${details.expirationDate?.toLocaleDateString() || 'No expiration'}`,
//     pageWidth - margin - 50,
//     y + 12
//   );

//   y += 25;

//   // Table
//   const tableData = products.map((p) => [
//     p.name,
//     p.modifiedDescription || p.description,
//     `$${(p.modifiedPrice || p.originalPrice).toFixed(2)}`,
//     `${p.quantity} ${p.unit || ''}`,
//     `$${((p.modifiedPrice || p.originalPrice) * p.quantity).toFixed(2)}`
//   ]);

//   autoTable(doc, {
//     startY: y,
//     margin: { left: margin },
//     head: [['ITEM', 'DESCRIPTION', 'PRICE', 'QTY', 'TOTAL']],
//     body: tableData,
//     styles: {
//       fontSize: 10,
//       cellPadding: 3,
//     },
//     headStyles: {
//       fillColor: [247, 147, 30],
//       textColor: 255,
//     },
//   });

//   let finalY = (doc as any).lastAutoTable.finalY + 10;

//   // Totals
//   const subtotal = products.reduce(
//     (acc, p) => acc + (p.modifiedPrice || p.originalPrice) * p.quantity,
//     0
//   );
//   const discounted = subtotal - (subtotal * details.discount) / 100;
//   const taxed = discounted + (discounted * details.tax) / 100;

//   const totals = [
//     ['Subtotal:', `$${subtotal.toFixed(2)}`],
//     [`Discount (${details.discount}%):`, `-$${(subtotal * details.discount / 100).toFixed(2)}`],
//     [`Tax (${details.tax}%):`, `$${((discounted * details.tax) / 100).toFixed(2)}`],
//     ['Total:', `$${taxed.toFixed(2)}`],
//   ];

//   totals.forEach(([label, value], i) => {
//     doc.setFont(undefined, i === 3 ? 'bold' : 'normal');
//     doc.setFontSize(i === 3 ? 12 : 10);
//     doc.text(label, pageWidth - margin - 50, finalY + i * 6);
//     doc.text(value, pageWidth - margin - 10, finalY + i * 6, { align: 'right' });
//   });

//   finalY += totals.length * 6 + 10;

//   // Notes
//   if (details.notes) {
//     doc.setFont(undefined, 'bold');
//     doc.text('Notes:', margin, finalY);
//     doc.setFont(undefined, 'normal');
//     const wrappedText = doc.splitTextToSize(details.notes, pageWidth - margin * 2);
//     doc.text(wrappedText, margin, finalY + 6);
//     finalY += wrappedText.length * 5 + 10;
//   }

//   // Signature
//   doc.setFontSize(10);
//   doc.text('Your Name & Signature', pageWidth - margin - 30, finalY + 30, { align: 'center' });
//   doc.text('Account Manager', pageWidth - margin - 30, finalY + 36, { align: 'center' });

//   doc.save(`${details.offerName || 'Offer'}.pdf`);
// }


