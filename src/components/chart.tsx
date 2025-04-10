import { useEffect, useState } from "react";
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

interface Repo {
  languages_url: string;
}

interface LanguageData {
  [language: string]: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface ReposPerLanguageChartProps {
  username?: string;
}

const ReposPerLanguageChart: React.FC<ReposPerLanguageChartProps> = ({
  username = "joshi232004manish"
}) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos: Repo[] = await res.json();

        const languageCount: LanguageData = {};

        for (const repo of repos) {
          const langRes = await fetch(repo.languages_url);
          const langData: LanguageData = await langRes.json();

          for (const lang in langData) {
            languageCount[lang] = (languageCount[lang] || 0) + langData[lang];
          }
        }

        const total = Object.values(languageCount).reduce((acc, curr) => acc + curr, 0);

        const percentageData: ChartData[] = Object.entries(languageCount).map(
          ([language, value]) => ({
            name: language,
            value: parseFloat(((value * 100) / total).toFixed(2))
          })
        );

        setData(percentageData);
      } catch (err) {
        console.error("Failed to fetch repos", err);
      }
    };

    fetchRepos();
  }, [username]);

  return (
    <div className="w-full flex justify-center items-center bg-[rgba(0,0,0,1)]">
      <Card className="bg-[rgba(0,0,0,1)] text-black p-4 w-full max-w-2xl border-none">
        <CardContent>
          <h2 className="text-2xl text-[rgb(229,144,144)] font-semibold mb-4 text-center">
            Languages Covered
          </h2>
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
                label={({value }) => `${value}%`}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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
};

export default ReposPerLanguageChart;
