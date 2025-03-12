"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Callout } from "@radix-ui/themes";
import axios from "axios";
import Spinner from "@/app/components/Spinner";

interface Issue {
    id: string;
    title: string;
}

const IssuesPage = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/issues"); // 🔥 Mengambil data dari API
            setIssues(response.data);
        } catch (err) {
            setError("Failed to fetch issues. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this issue?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/issues/${id}`);
            setIssues(issues.filter(issue => issue.id !== id)); // 🔄 Hapus dari state setelah sukses
        } catch (error) {
            console.error("Failed to delete issue:", error);
            setError("Failed to delete issue. Please try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Issue List</h1>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center">
                    <Spinner />
                    <p className="ml-2 text-gray-600">Loading issues...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Callout.Root color="red" className="mb-4">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}

            {/* Issues List */}
            {!loading && !error && (
                <ul className="divide-y divide-gray-200 border border-gray-300 rounded-md">
                    {issues.length > 0 ? (
                        issues.map((issue) => (
                            <li
                                key={issue.id}
                                className="flex justify-between items-center p-4 hover:bg-gray-100 transition"
                            >
                                <Link href={`/issues/${issue.id}`} className="text-blue-600 hover:underline font-medium">
                                    {issue.title}
                                </Link>
                                <Button
                                    onClick={() => handleDelete(issue.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Delete
                                </Button>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No issues found.</p>
                    )}
                </ul>
            )}

            {/* Button New Issue */}
            <div className="flex justify-center mt-6">
                <Link href="/issues/new">
                    <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        New Issue
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default IssuesPage;
