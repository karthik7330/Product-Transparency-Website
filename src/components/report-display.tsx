'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, RefreshCw } from 'lucide-react';
import type { FormData } from './clarity-app';

interface ReportDisplayProps {
  formData: FormData;
  summary: string;
  onReset: () => void;
}

export function ReportDisplay({ formData, summary, onReset }: ReportDisplayProps) {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
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
            <Accordion type="single" collapsible className="w-full">
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
        <CardFooter>
            <Button onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New Report
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
