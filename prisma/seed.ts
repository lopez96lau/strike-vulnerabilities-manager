import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.vulnerability.createMany({
    data: [
      {
        updatedAt: new Date(),
        title: "SQL Injection in Login Form",
        description:
          "Allows an attacker to bypass authentication via SQL Injection.",
        severity: "Critical",
        cwe: "CWE-89",
        status: "Pending Fix",
      },
      {
        updatedAt: new Date(),
        title: "Cross-Site Scripting (XSS) in Comments",
        description:
          "User input is not sanitized, leading to potential XSS attacks.",
        severity: "High",
        cwe: "CWE-79",
        status: "In Progress",
      },
      {
        updatedAt: new Date(),
        title: "Insecure Direct Object Reference (IDOR)",
        description:
          "User can access unauthorized resources by modifying request parameters.",
        severity: "Medium",
        cwe: "CWE-639",
        status: "Pending Fix",
      },
      {
        updatedAt: new Date(),
        title: "Weak Password Policy",
        description:
          "System allows very weak passwords, increasing brute-force attack risk.",
        severity: "Low",
        cwe: "CWE-521",
        status: "Solved",
      },
    ],
  });

  console.log("✅ Vulnerabilities seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
