import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportItem {
  description: string;
  quantity: number;
  rate: number;
}

export interface ExportData {
  number: string;
  clientName: string;
  clientEmail: string;
  providerName?: string;
  providerEmail?: string;
  providerAddress?: string;
  items: ExportItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  date: string;
  dueDate?: string;
  notes?: string;
  type: 'invoice' | 'quote';
}

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(24);
  doc.text(data.type === 'invoice' ? 'INVOICE' : 'QUOTE', 14, 20);
  
  // Document number and date
  doc.setFontSize(10);
  doc.text(`${data.type === 'invoice' ? 'Invoice' : 'Quote'} #: ${data.number}`, 14, 30);
  doc.text(`Date: ${data.date}`, 14, 36);
  if (data.dueDate) {
    doc.text(`Due Date: ${data.dueDate}`, 14, 42);
  }
  
  // Provider details (From)
  if (data.providerName || data.providerEmail || data.providerAddress) {
    doc.setFontSize(12);
    doc.text('From:', 14, data.dueDate ? 52 : 46);
    doc.setFontSize(10);
    let yPos = data.dueDate ? 58 : 52;
    if (data.providerName) {
      doc.text(data.providerName, 14, yPos);
      yPos += 6;
    }
    if (data.providerEmail) {
      doc.text(data.providerEmail, 14, yPos);
      yPos += 6;
    }
    if (data.providerAddress) {
      const addressLines = doc.splitTextToSize(data.providerAddress, 80);
      doc.text(addressLines, 14, yPos);
    }
  }
  
  // Client details (To)
  doc.setFontSize(12);
  doc.text('To:', 120, data.dueDate ? 52 : 46);
  doc.setFontSize(10);
  doc.text(data.clientName, 120, data.dueDate ? 58 : 52);
  doc.text(data.clientEmail, 120, data.dueDate ? 64 : 58);
  
  // Line items table
  const tableData = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `${data.currency} ${item.rate.toFixed(2)}`,
    `${data.currency} ${(item.quantity * item.rate).toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: 90,
    head: [['Description', 'Quantity', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 80, 167] },
  });
  
  // Totals
  const finalY = (doc as any).lastAutoTable.finalY || 90;
  doc.text(`Subtotal: ${data.currency} ${data.subtotal.toFixed(2)}`, 140, finalY + 10);
  doc.text(`Tax (10%): ${data.currency} ${data.tax.toFixed(2)}`, 140, finalY + 16);
  doc.setFontSize(12);
  doc.text(`Total: ${data.currency} ${data.total.toFixed(2)}`, 140, finalY + 24);
  
  // Notes
  if (data.notes) {
    doc.setFontSize(10);
    doc.text('Notes:', 14, finalY + 34);
    const notesLines = doc.splitTextToSize(data.notes, 180);
    doc.text(notesLines, 14, finalY + 40);
  }
  
  doc.save(`${data.type}-${data.number}.pdf`);
};

export const exportToCSV = (data: ExportData) => {
  const rows = [
    [`${data.type.toUpperCase()} #`, data.number],
    ['Date', data.date],
    ...(data.dueDate ? [['Due Date', data.dueDate]] : []),
    [''],
    ['From'],
    ...(data.providerName ? [['Name', data.providerName]] : []),
    ...(data.providerEmail ? [['Email', data.providerEmail]] : []),
    ...(data.providerAddress ? [['Address', data.providerAddress]] : []),
    [''],
    ['To'],
    ['Name', data.clientName],
    ['Email', data.clientEmail],
    [''],
    ['Description', 'Quantity', 'Rate', 'Amount'],
    ...data.items.map(item => [
      item.description,
      item.quantity.toString(),
      `${data.currency} ${item.rate.toFixed(2)}`,
      `${data.currency} ${(item.quantity * item.rate).toFixed(2)}`
    ]),
    [''],
    ['Subtotal', `${data.currency} ${data.subtotal.toFixed(2)}`],
    ['Tax (10%)', `${data.currency} ${data.tax.toFixed(2)}`],
    ['Total', `${data.currency} ${data.total.toFixed(2)}`],
    ...(data.notes ? [[''], ['Notes', data.notes]] : [])
  ];
  
  const csv = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.type}-${data.number}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data: ExportData) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.type}-${data.number}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};