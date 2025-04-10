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
import axios from "axios";

const COLORS = ["#61C454", "#F6C14F", "#EF5A78", "#9B59B6", "#3498DB"];

export default function ReposPerLanguageChart({ username = "joshi232004manish" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
        try {
          const res = await fetch(`https://api.github.com/users/${username}/repos`);
          const repos = await res.json();
          console.log(repos);
      
          const languageCount = {};
      
          for (const repo of repos) {
            // Fetch detailed language breakdown
            const langRes = await fetch(repo.languages_url,
          {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
            },
          });
            console.log(langRes);
            const langData = await langRes.json();
            console.log(langData);
      
            // Count all languages used in this repo
            for (const lang in langData) {
              languageCount[lang] = (languageCount[lang] || 0) + langData[lang];
            }
          }
          let total = 0;
          for(const lang in languageCount) {
            total += languageCount[lang];
            
          }
          for(const lang in languageCount) {
            languageCount[lang] = parseFloat((languageCount[lang] * 100 / total).toFixed(2));
            
          }
            console.log(total);
      
          // Convert to array format for charts, etc.
          const formattedData = Object.entries(languageCount).map(
            ([language, value]) => ({
              name: language,
              value
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
    <div className="w-full flex justify-center items-center bg-[rgba(0,0,0,1)] ">
    <Card className="bg-[rgba(0,0,0,1)] text-black p-4 w-full max-w-2xl border-none">
      <CardContent>
        <h2 className="text-2xl text-[rgb(229,144,144)] font-semibold mb-4 text-center">Languages Covered</h2>
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
              label={({ name, value }) => `${value}%`}
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
    </div>
  );
}
