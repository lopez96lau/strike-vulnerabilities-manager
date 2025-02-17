import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { id, title, description, severity, status, evidence, assignedTo } =
    await req.json();
  const updatedVulnerability = await prisma.vulnerability.update({
    where: { id },
    data: {
      title,
      description,
      severity,
      status,
      evidence,
      assignedTo,
      updatedAt: new Date(),
    },
  });
  return NextResponse.json(updatedVulnerability);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await prisma.vulnerability.delete({
    where: { id: parseInt(id) },
  });
  return NextResponse.json({ message: "Vulnerability deleted" });
}
