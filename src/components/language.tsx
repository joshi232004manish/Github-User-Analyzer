import { useEffect, useState } from "react"
import axios from "axios"

interface Props {
  username: string
  repo: string
}

interface LanguageData {
  [key: string]: number
}

export default function LanguagesBarChart({ username, repo }: Props) {
  const [languages, setLanguages] = useState<{ name: string; percent: number; color: string }[]>([])

  const languageColors: { [key: string]: string } = {
    JavaScript: "#facc15",
    TypeScript: "#38bdf8",
    Python: "#22c55e",
    HTML: "#f97316",
    CSS: "#a855f7",
    Other: "#e4e4e7",
  }

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await axios.get<LanguageData>(
          `https://api.github.com/repos/${username}/${repo}/languages`, {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
            },
          }
        )

        const total = Object.values(res.data).reduce((acc, val) => acc + val, 0)

        const formatted = Object.entries(res.data).map(([name, value]) => ({
          name,
          percent: Number(((value / total) * 100).toFixed(1)),
          color: languageColors[name] || languageColors["Other"],
        }))

        setLanguages(formatted)
      } catch (error) {
        console.error("Failed to fetch language data:", error)
      }
    }

    fetchLanguages()
  }, [username, repo])

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">Languages</h2>
      <div className="w-full h-3 rounded-full overflow-hidden bg-zinc-200 mb-3 flex">
        {languages.map((lang, idx) => (
          <div
            key={idx}
            style={{
              width: `${lang.percent}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name}: ${lang.percent}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-zinc-700">
        {languages.map((lang, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: lang.color }}
            ></span>
            <span className="font-medium">{lang.name}</span>
            <span className="text-zinc-500">{lang.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
