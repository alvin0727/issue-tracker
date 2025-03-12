'use client';

import dynamic from "next/dynamic";
import { Button, Callout, TextField } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from 'zod';
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

// Lazy import SimpleMDE dengan SSR dinonaktifkan
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema)
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setIsSubmitting(true);
            await axios.post('/api/issues', data);
            router.push('/issues');
        } catch (error) {
            setIsSubmitting(false);
            setError('An unexpected error occurred. Please try again later.');
        }
    });

    return (
        <div className='max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg'>
            {error && (
                <Callout.Root color="red" className="mb-5">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}

            <form className='space-y-4' onSubmit={onSubmit}>
                {/* Input Title */}
                <div>
                    <TextField.Root
                        placeholder='Title'
                        {...register('title')}
                        aria-invalid={!!errors.title}
                        className="w-full border p-2 rounded-md"
                    />
                    {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
                </div>

                {/* Input Description */}
                <div>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <SimpleMDE placeholder='Description' {...field} />
                        )}
                    />
                    {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
                </div>

                {/* Submit Button */}
                <Button disabled={isSubmitting} className="w-full py-2 mt-4">
                    {isSubmitting ? <><Spinner /> Submitting...</> : "Submit New Issue"}
                </Button>
            </form>
        </div>
    );
};

export default NewIssuePage;
