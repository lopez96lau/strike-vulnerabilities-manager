import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Missing Vulnerability ID" },
      { status: 400 }
    );
  }
  const { title, description, severity, status, evidence, assignedTo } =
    await request.json();

  // Validate status transitions
  if (status === "In Progress" && !assignedTo) {
    return NextResponse.json(
      { error: "Cannot move to In Progress without an assigned user" },
      { status: 400 }
    );
  }

  if (["Validation", "False Positive", "Solved"].includes(status)) {
    if (!assignedTo || !evidence) {
      return NextResponse.json(
        {
          error:
            "Cannot move to this status without an assigned user and evidence",
        },
        { status: 400 }
      );
    }
  }

  try {
    const updatedVulnerability = await prisma.vulnerability.update({
      where: { id: parseInt(id) },
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
  } catch {
    return NextResponse.json(
      { error: "Failed to update vulnerability" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Missing Vulnerability ID" },
      { status: 400 }
    );
  }
  await prisma.vulnerability.delete({
    where: { id: parseInt(id) },
  });
  return NextResponse.json({ message: "Vulnerability deleted" });
}
