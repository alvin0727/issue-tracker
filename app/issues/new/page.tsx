'use client';

import dynamic from "next/dynamic";
import { Button, TextField } from '@radix-ui/themes';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";

// Lazy import SimpleMDE dengan SSR dinonaktifkan
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

interface IssueForm {
    title: string;
    description: string;
}
const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit } = useForm<IssueForm>();
    return (
        <form className='max-w-xl space-y-3' onSubmit={handleSubmit(async (data) => {
            await axios.post('/api/issues', data);
            router.push('/issues');

        })}>
            <TextField.Root placeholder='Title' {...register('title')} />
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <SimpleMDE placeholder='Description'  {...field} />
                )}
            />
            <Button type="submit">Submit New Issue</Button>
        </form>
    );
};

export default NewIssuePage;