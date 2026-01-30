// تصدير جدول HTML إلى Excel
export function exportTableToExcel(tableId, filename = 'export.xlsx') {
  const table = document.getElementById(tableId);
  let tableHTML = table.outerHTML.replace(/ /g, '%20');
  const a = document.createElement('a');
  a.href = 'data:application/vnd.ms-excel,' + tableHTML;
  a.download = filename;
  a.click();
}

// تصدير جدول HTML إلى PDF (يتطلب مكتبة jsPDF)
export function exportTableToPDF(tableId, filename = 'export.pdf') {
  import('jspdf').then(jsPDF => {
    const doc = new jsPDF.jsPDF();
    doc.autoTable({ html: '#' + tableId });
    doc.save(filename);
  });
}
