'use client';

import { useState } from 'react';
import { ProductForm } from '@/components/product-form';
import { ReportDisplay } from '@/components/report-display';
import { summarizeTransparencyReport } from '@/ai/flows/summarize-transparency-report';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface FormData {
  [key: string]: string;
}

export function ClarityApp() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    setFormData(data);

    try {
      const reportText = Object.entries(data)
        .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
        .join('\n\n');
      
      const result = await summarizeTransparencyReport({ report: reportText });
      setSummary(result.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate the report summary. Please try again.',
        variant: 'destructive',
      });
      setFormData(null); // Reset to show form again
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(null);
    setSummary(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4 flex justify-center items-center">
        <Card className="w-full">
          <CardContent className="p-10 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your transparency report...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (formData && summary) {
    return <ReportDisplay formData={formData} summary={summary} onReset={handleReset} />;
  }

  return <ProductForm onFormSubmit={handleFormSubmit} />;
}
