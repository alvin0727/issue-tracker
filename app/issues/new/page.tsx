'use client';

import dynamic from "next/dynamic";
import { Button, Callout, TextField, Text } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from 'zod';
import ErrorMessage from "@/app/components/ErrorMessage";

// Lazy import SimpleMDE dengan SSR dinonaktifkan
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema)
    });
    const [error, setError] = useState('');
    return (
        <div className='max-w-xl'>
            {error && <Callout.Root color="red" className="mb-5">
                <Callout.Text>{error}</Callout.Text>
            </Callout.Root>}
            <form className='space-y-3' onSubmit={handleSubmit(async (data) => {
                try {
                    await axios.post('/api/issues', data);
                    router.push('/issues');
                } catch (error) {
                    setError('An unexpected error occurred. Please try again later.');
                }

            })}>
                <TextField.Root placeholder='Title' {...register('title')} />
                <ErrorMessage >{errors.title?.message}</ErrorMessage>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <SimpleMDE placeholder='Description'  {...field} />
                    )}
                />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>
                <Button type="submit">Submit New Issue</Button>
            </form>
        </div>
    );
};

export default NewIssuePage;