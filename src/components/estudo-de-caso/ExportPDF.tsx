import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

interface ExportPDFProps {
  targetId: string;
  filename: string;
}

const ExportPDF = ({ targetId, filename }: ExportPDFProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);

    try {
      const budgetEl = document.getElementById(targetId);
      if (!budgetEl) return;

      // Temporarily show budget element for capture
      budgetEl.classList.remove('hidden');

      // Find the two page divs inside the budget document
      const pages = budgetEl.querySelectorAll<HTMLElement>('[data-pdf-page]');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      if (pages.length > 0) {
        // Capture each page separately for clean page breaks
        for (let i = 0; i < pages.length; i++) {
          const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#FFFFFF',
            windowWidth: 900,
          });

          if (i > 0) pdf.addPage();

          const imgData = canvas.toDataURL('image/png');
          const ratio = contentWidth / canvas.width;
          const scaledHeight = canvas.height * ratio;

          // Fit to page height, center vertically if shorter
          const finalHeight = Math.min(scaledHeight, contentHeight);
          const finalWidth = finalHeight === contentHeight
            ? (canvas.width * (contentHeight / canvas.height))
            : contentWidth;

          pdf.addImage(imgData, 'PNG', margin, margin, finalWidth, finalHeight);
        }
      } else {
        // Fallback: single capture
        const canvas = await html2canvas(budgetEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
          windowWidth: 900,
        });
        const imgData = canvas.toDataURL('image/png');
        const ratio = contentWidth / canvas.width;
        const scaledHeight = canvas.height * ratio;
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, scaledHeight);
      }

      budgetEl.classList.add('hidden');
      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setLoading(false);
    }
  }, [targetId, filename]);

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2.5 bg-foreground text-background font-semibold py-3.5 px-8 rounded-xl text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? 'Gerando PDF...' : 'Baixar Orçamento'}
    </button>
  );
};

export default ExportPDF;
