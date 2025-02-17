import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all vulnerabilities
export async function GET() {
  const vulnerabilities = await prisma.vulnerability.findMany();
  return NextResponse.json(vulnerabilities);
}

// Create a new vulnerability
export async function POST(req: Request) {
  const { title, description, severity, cwe, status } = await req.json();
  const newVulnerability = await prisma.vulnerability.create({
    data: {
      title,
      description,
      severity,
      cwe,
      status,
      updatedAt: new Date(),
    },
  });
  return NextResponse.json(newVulnerability, { status: 201 });
}
