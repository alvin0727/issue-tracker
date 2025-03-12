'use client';

import dynamic from "next/dynamic";
import { Button, Callout, TextField, Select } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { updateIssueSchema } from "@/app/validationSchemas";
import { z } from 'zod';
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

// Lazy import SimpleMDE dengan SSR dinonaktifkan
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueForm = z.infer<typeof updateIssueSchema>;

const UpdateIssuePage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(updateIssueSchema),
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await axios.get(`/api/issues/${id}`);
                const issueData = response.data;
                setValue('title', issueData.title);
                setValue('description', issueData.description);
                setValue('status', issueData.status);
            } catch (err) {
                setError('Failed to fetch issue details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchIssue();
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setIsSubmitting(true);
            await axios.patch(`/api/issues/${id}`, data);
            router.push(`/issues/${id}`);
        } catch (error) {
            setIsSubmitting(false);
            setError('An unexpected error occurred. Please try again later.');
        }
    });

    return (
        <div className='max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg'>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Update Issue</h1>

            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : (
                <>
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

                        {/* Select Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select.Root
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <Select.Trigger className="w-full border p-2 rounded-md" />
                                        <Select.Content>
                                            <Select.Item value="OPEN">Open</Select.Item>
                                            <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
                                            <Select.Item value="CLOSED">Closed</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                            {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
                        </div>

                        {/* Submit Button */}
                        <Button disabled={isSubmitting} className="w-full py-2 mt-4">
                            {isSubmitting ? <><Spinner /> Updating...</> : "Update Issue"}
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
};

export default UpdateIssuePage;
