import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToJSON = (data: any, fileName: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToCSV = (items: any[], fileName: string) => {
  if (items.length === 0) return;
  
  const headers = Object.keys(items[0]);
  const csvRows = [
    headers.join(','),
    ...items.map(item => 
      headers.map(header => {
        const value = item[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ];
  
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (data: any, fileName: string, type: 'invoice' | 'quote') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(24);
  doc.text(type === 'invoice' ? 'INVOICE' : 'QUOTE', 14, 20);
  
  // Document details
  doc.setFontSize(10);
  doc.text(`${type === 'invoice' ? 'Invoice #' : 'Quote'}: ${data.invoice_number || data.title}`, 14, 30);
  doc.text(`Date: ${new Date(data.created_at).toLocaleDateString()}`, 14, 36);
  if (data.due_date) {
    doc.text(`Due Date: ${new Date(data.due_date).toLocaleDateString()}`, 14, 42);
  }
  
  // Provider details
  if (data.provider_name || data.provider_email) {
    doc.setFontSize(12);
    doc.text('From:', 14, data.due_date ? 52 : 46);
    doc.setFontSize(10);
    let yPos = data.due_date ? 58 : 52;
    if (data.provider_name) {
      doc.text(data.provider_name, 14, yPos);
      yPos += 6;
    }
    if (data.provider_email) {
      doc.text(data.provider_email, 14, yPos);
      yPos += 6;
    }
    if (data.provider_address) {
      const addressLines = doc.splitTextToSize(data.provider_address, 80);
      doc.text(addressLines, 14, yPos);
    }
  }
  
  // Client details
  doc.setFontSize(12);
  doc.text('To:', 120, data.due_date ? 52 : 46);
  doc.setFontSize(10);
  doc.text(data.client_name, 120, data.due_date ? 58 : 52);
  doc.text(data.client_email, 120, data.due_date ? 64 : 58);
  
  // Summary section
  const summaryY = 90;
  doc.setFontSize(10);
  doc.text(`Subtotal: ${data.currency || 'USD'} ${(data.subtotal || 0).toFixed(2)}`, 14, summaryY);
  doc.text(`Tax: ${data.currency || 'USD'} ${(data.tax || 0).toFixed(2)}`, 14, summaryY + 6);
  doc.setFontSize(12);
  doc.text(`Total: ${data.currency || 'USD'} ${(data.total || 0).toFixed(2)}`, 14, summaryY + 14);
  
  if (data.category) {
    doc.setFontSize(10);
    doc.text(`Category: ${data.category}`, 14, summaryY + 22);
  }
  
  doc.save(`${fileName}.pdf`);
};
