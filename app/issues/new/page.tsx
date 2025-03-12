'use client';

import dynamic from "next/dynamic";
import { Button, TextField } from '@radix-ui/themes';
import "easymde/dist/easymde.min.css";

// Lazy import SimpleMDE dengan SSR dinonaktifkan
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

const NewIssuePage = () => {
    return (
        <div className='max-w-xl space-y-3'>
            <TextField.Root placeholder='Title' />
            <SimpleMDE placeholder='Description' />
            <Button>Submit New Issue</Button>
        </div>
    );
};

export default NewIssuePage;