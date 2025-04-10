import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const COLORS = ["#61C454", "#F6C14F", "#EF5A78", "#9B59B6", "#3498DB"];

export default function ReposPerLanguageChart({ username = "22push" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await res.json();

        const languageCount = {};
        repos.forEach((repo) => {
          const lang = repo.language;
          if (lang) {
            languageCount[lang] = (languageCount[lang] || 0) + 1;
          }
        });

        const formattedData = Object.entries(languageCount).map(
          ([language, count]) => ({
            name: language,
            value: count
          })
        );

        setData(formattedData);
      } catch (err) {
        console.error("Failed to fetch repos", err);
      }
    };

    fetchRepos();
  }, [username]);

  return (
    <Card className="bg-[#eae5dc] text-black p-4 w-full max-w-2xl">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4">Repos per Language</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
