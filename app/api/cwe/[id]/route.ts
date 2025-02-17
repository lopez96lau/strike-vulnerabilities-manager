import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing CWE ID" }, { status: 400 });
  }

  const url = new URL(`https://cwe-api.mitre.org/api/v1/cwe/weakness/${id}`);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Strike Vulnerabilities Manager",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`CWE API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("CWE API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch CWE data" },
      { status: 500 }
    );
  }
}
