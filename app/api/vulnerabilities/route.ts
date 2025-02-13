import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const vulnerabilities = await prisma.vulnerability.findMany();
  return NextResponse.json(vulnerabilities);
}

export async function POST(req: Request) {
  const { title, description, severity, cwe, status } = await req.json();
  const newVulnerability = await prisma.vulnerability.create({
    data: {
      title,
      description,
      severity,
      cwe,
      status,
      id: "0",
      updatedAt: new Date(),
    },
  });
  return NextResponse.json(newVulnerability, { status: 201 });
}
