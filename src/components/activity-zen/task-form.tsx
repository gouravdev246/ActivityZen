'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type Activity } from '@/lib/types';
import { useEffect } from 'react';
import { isValid } from 'date-fns';

const FormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().optional(),
  startTime: z.string().refine((val) => val, { message: 'Start time is required.' }),
  endTime: z.string().optional(),
}).refine(data => {
    if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
    }
    return true;
}, {
    message: "End time must be after start time.",
    path: ["endTime"],
});

type TaskFormProps = {
  onSubmit: (data: Omit<Activity, 'id' | 'createdAt'>) => void;
  activityToEdit?: Activity | null;
};

const toDateTimeLocal = (date: Date | null | undefined) => {
  if (!date || !isValid(date)) return '';
  // Adjust for timezone offset
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16);
};


export default function TaskForm({ onSubmit, activityToEdit }: TaskFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    },
  });

  useEffect(() => {
    if (activityToEdit) {
      form.reset({
        title: activityToEdit.title,
        description: activityToEdit.description || '',
        startTime: toDateTimeLocal(activityToEdit.startTime),
        endTime: toDateTimeLocal(activityToEdit.endTime),
      });
    } else {
      form.reset({
        title: '',
        description: '',
        startTime: toDateTimeLocal(new Date()),
        endTime: '',
      });
    }
  }, [activityToEdit, form]);

  const handleFormSubmit = (data: z.infer<typeof FormSchema>) => {
    const finalData = {
        ...data,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
    };
    
    if (activityToEdit) {
      onSubmit({ ...activityToEdit, ...finalData });
    } else {
      onSubmit(finalData);
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Morning Walk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add more details about the activity..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <Button type="submit" className="w-full">
          {activityToEdit ? 'Save Changes' : 'Log Activity'}
        </Button>
      </form>
    </Form>
  );
}
