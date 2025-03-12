import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateIssueSchema } from "@/app/validationSchemas";

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        // 🔥 Pastikan params.id diakses secara async
        const { id } = await context.params;

        const issueId = Number(id);
        if (isNaN(issueId)) {
            return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
        }

        const issue = await prisma.issue.findUnique({
            where: { id: issueId },
        });

        if (!issue) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        }

        return NextResponse.json(issue);
    } catch (error) {
        console.error("Error fetching issue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        // 🔥 Pastikan params.id diakses secara async
        const { id } = await context.params;

        const issueId = Number(id);
        if (isNaN(issueId)) {
            return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
        }

        const body = await request.json();
        const validation = updateIssueSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const updatedIssue = await prisma.issue.update({
            where: { id: issueId },
            data: body,
        });

        return NextResponse.json(updatedIssue);
    } catch (error) {
        console.error("Error updating issue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        // 🔥 Pastikan params.id diakses secara async
        const { id } = await context.params;

        const issueId = Number(id);
        if (isNaN(issueId)) {
            return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
        }

        // 🔍 Cek apakah issue ada sebelum menghapus
        const issue = await prisma.issue.findUnique({
            where: { id: issueId },
        });

        if (!issue) {
            return NextResponse.json({ error: "Issue not found" }, { status: 404 });
        }

        // 🗑️ Hapus issue dari database
        await prisma.issue.delete({
            where: { id: issueId },
        });

        return NextResponse.json({ message: "Issue deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting issue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}