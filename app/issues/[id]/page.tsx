"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button, Callout } from "@radix-ui/themes";

interface Issue {
    id: number;
    title: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED"; // Enum untuk status
}

const IssueDetailPage = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await axios.get(`/api/issues/${id}`);
                setIssue(response.data);
            } catch (err) {
                setError("Failed to fetch issue details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchIssue();
    }, [id]);

    // Fungsi untuk menentukan warna berdasarkan status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN":
                return "text-green-600 bg-green-100 px-2 py-1 rounded-md";
            case "IN_PROGRESS":
                return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md";
            case "CLOSED":
                return "text-red-600 bg-red-100 px-2 py-1 rounded-md";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : error ? (
                <Callout.Root color="red">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            ) : issue ? (
                <>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">{issue.title}</h1>

                    {/* Tabel Detail Issue */}
                    <table className="w-full border-collapse border border-gray-300 mb-4">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="p-3 font-medium text-gray-700">Description</td>
                                <td className="p-3 text-gray-600">{issue.description}</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-gray-700">Status</td>
                                <td className="p-3">
                                    <span className={getStatusColor(issue.status)}>
                                        {issue.status}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="text-center text-gray-500">Issue not found</p>
            )}

            <div className="flex justify-between mt-6">
                <Link href="/issues">
                    <Button className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                        Back to Issues
                    </Button>
                </Link>
                <Link href={`/issues/${id}/UpdateIssue`}>
                    <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Update
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default IssueDetailPage;
