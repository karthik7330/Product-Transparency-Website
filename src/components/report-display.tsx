'use client';

import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, RefreshCw, Download, Loader2 } from 'lucide-react';
import type { FormData } from './clarity-app';

interface ReportDisplayProps {
  formData: FormData;
  summary: string;
  onReset: () => void;
}

export function ReportDisplay({ formData, summary, onReset }: ReportDisplayProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const pdf = new jsPDF();
    
    pdf.setFontSize(18);
    pdf.text('Product Transparency Report', 14, 22);

    pdf.setFontSize(12);
    pdf.text('AI-generated summary and full product details.', 14, 30);

    pdf.setFontSize(14);
    pdf.setTextColor(64, 150, 246); // primary color
    pdf.text('AI Summary', 14, 45);
    pdf.setTextColor(0, 0, 0);
    
    // Use splitTextToSize for auto-wrapping
    const summaryLines = pdf.splitTextToSize(summary, 180);
    pdf.setFontSize(10);
    pdf.text(summaryLines, 14, 52);

    let yPosition = 52 + (summaryLines.length * 5) + 10;

    pdf.setFontSize(14);
    pdf.setTextColor(64, 150, 246);
    pdf.text('Full Details', 14, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 7;

    pdf.setFontSize(12);
    Object.entries(formData).forEach(([question, answer]) => {
      if (yPosition > 280) { // check for new page
          pdf.addPage();
          yPosition = 20;
      }
      pdf.setFont('helvetica', 'bold');
      const questionLines = pdf.splitTextToSize(`Q: ${question}`, 180);
      pdf.text(questionLines, 14, yPosition);
      yPosition += (questionLines.length * 5);

      pdf.setFont('helvetica', 'normal');
      const answerLines = pdf.splitTextToSize(`A: ${answer}`, 180);
      pdf.text(answerLines, 14, yPosition);
      yPosition += (answerLines.length * 5) + 5; // add some space after answer
    });

    pdf.save('product-transparency-report.pdf');
    setIsGeneratingPdf(false);
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
      <div ref={reportRef}>
        <Card className="shadow-2xl shadow-primary/10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-headline">Product Transparency Report</CardTitle>
                <CardDescription>AI-generated summary and full product details.</CardDescription>
              </div>
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">AI Summary</h3>
              <div className="text-muted-foreground bg-secondary/50 p-4 rounded-md border prose prose-sm max-w-none dark:prose-invert">
                <p>{summary}</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Full Details</h3>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {Object.entries(formData).map(([question, answer], index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{question}</AccordionTrigger>
                    <AccordionContent>
                      {answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardFooter className="p-4 flex justify-between">
            <Button onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New Report
            </Button>
            <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
