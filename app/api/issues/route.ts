import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { createIssueSchema } from "@/app/validationSchemas";


export async function GET() {
    try {
        const issues = await prisma.issue.findMany();
        return NextResponse.json(issues, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), { status: 400 });

    const newIssue = await prisma.issue.create({
        data: { title: body.title, description: body.description }
    });

    return NextResponse.json(newIssue, { status: 201 });
} 