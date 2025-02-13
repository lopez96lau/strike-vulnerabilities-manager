"use client";
import { useEffect, useState } from "react";

export default function Vulnerabilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vulnerabilities")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Vulnerabilidades</h1>
      <ul>
        {data.map((vuln: any) => (
          <li key={vuln?.id}>
            {vuln?.title} - {vuln?.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
