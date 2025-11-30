import { useState, type RefObject } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExportOptions {
  filename?: string;
  title?: string;
}

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToPdf = async (
    elementRef: RefObject<HTMLDivElement | null>,
    options: ExportOptions = {}
  ) => {
    const { title = "Analytics Report" } = options;

    if (!elementRef.current) {
      toast({
        title: "Export Failed",
        description: "Unable to find chart element",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const element = elementRef.current;
      const timestamp = new Date().toLocaleString();
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error("Could not open print window. Please allow popups.");
      }

      // Clone the content and prepare for printing
      const content = element.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                padding: 20px;
                background: white;
                color: #1a1a1a;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e5e5e5;
              }
              .header h1 {
                font-size: 24px;
                margin-bottom: 8px;
                color: #1a1a1a;
              }
              .header .timestamp {
                font-size: 12px;
                color: #666;
              }
              .content {
                padding: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #e5e5e5;
                font-size: 10px;
                color: #999;
              }
              /* Override dark mode styles for printing */
              [class*="bg-muted"] {
                background-color: #f5f5f5 !important;
              }
              [class*="text-muted"] {
                color: #666 !important;
              }
              svg {
                max-width: 100%;
                height: auto;
              }
              @media print {
                body {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <p class="timestamp">Generated: ${timestamp}</p>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              ICSCore Cyber Defense Platform - Confidential
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };

      toast({
        title: "Print Dialog Opened",
        description: "Use 'Save as PDF' in the print dialog to export",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPdf, isExporting };
};
