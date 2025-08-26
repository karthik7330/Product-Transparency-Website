'use client';

import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    
    const canvas = await html2canvas(reportRef.current, { 
      scale: 2,
      useCORS: true,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#1a202c' : '#f5f5f5',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
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
