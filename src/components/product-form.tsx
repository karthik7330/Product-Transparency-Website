'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateFollowUpQuestions } from '@/ai/flows/generate-follow-up-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { FormData } from './clarity-app';

interface ProductFormProps {
  onFormSubmit: (data: FormData) => void;
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea';
}

const initialQuestions: Question[] = [
  { id: 'productName', text: "What is the name of the product?", type: 'text' },
  { id: 'productCategory', text: "What category does the product belong to (e.g., food, electronics, clothing)?", type: 'text' },
  { id: 'mainMaterials', text: "What are the primary materials or ingredients used in this product?", type: 'textarea' },
];

const formSchema = z.object({
  answer: z.string().min(2, { message: "Please provide a more detailed answer." }),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm({ onFormSubmit }: ProductFormProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<FormData>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: '',
    },
  });

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleNext: SubmitHandler<FormValues> = async (data) => {
    const newAnswers = { ...answers, [currentQuestion.text]: data.answer };
    setAnswers(newAnswers);
    form.reset({ answer: '' });

    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }

    // On last question, try to generate more questions
    setIsGenerating(true);
    try {
      const result = await generateFollowUpQuestions({
        previousAnswers: newAnswers,
        currentQuestion: currentQuestion.text,
      });

      if (result.followUpQuestions && result.followUpQuestions.length > 0) {
        const newQuestions: Question[] = result.followUpQuestions.map((q, i) => ({
          id: `gen_${currentQuestionIndex}_${i}`,
          text: q,
          type: 'textarea',
        }));
        setQuestions([...questions, ...newQuestions]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // No more questions, submit the form
        onFormSubmit(newAnswers);
      }
    } catch (e) {
      console.error("Failed to generate questions, submitting form.", e);
      onFormSubmit(newAnswers); // Failsafe
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleFinish = () => {
    const currentAnswerValue = form.getValues('answer');
    const finalAnswers = { ...answers };
    if (currentAnswerValue && currentAnswerValue.trim() !== '') {
        finalAnswers[currentQuestion.text] = currentAnswerValue;
    }
    onFormSubmit(finalAnswers);
  };


  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Card className="shadow-2xl shadow-primary/10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-headline">Product Transparency Form</CardTitle>
              <CardDescription>Answer a few questions to generate your report.</CardDescription>
            </div>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">{currentQuestion.text}</FormLabel>
                    <FormControl>
                      {currentQuestion.type === 'textarea' ? (
                        <Textarea placeholder="Your detailed answer..." {...field} rows={5} />
                      ) : (
                        <Input placeholder="Your answer..." {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="ghost" onClick={handleFinish} disabled={isGenerating}>
                Finish & Generate Report
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : isLastQuestion ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Next (AI Follow-up)
                  </>
                ) : (
                  'Next Question'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
