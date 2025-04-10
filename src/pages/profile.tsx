import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import Chart from "@/components/chart";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useDialogContext } from "@/store/userContext";
import { Star, GitFork } from "lucide-react";

interface GitHubUser {
  avatar_url: string;
  login: string;
  created_at: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubUser1 {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export default function GitHubProfileCard() {
  const { user } = useDialogContext();
  const [repos, setRepos] = useState<
    { id: number; name: string; description: string; language: string; stargazers_count: number; forks_count: number; size: number }[]
  >([]);
  const [stats, setStats] = useState<GitHubUser | null>(null);
  const [userData, setUserData] = useState<GitHubUser1 | null>(null);
  const [rateLimit, setRateLimit] = useState<{
    remaining: number;
    limit: number;
  }>({ remaining: 0, limit: 0 });
  // const username = "joshi232004manish"
  const username = user;
  const Navigate = useNavigate();
  // const repo = "shelter_seeker"
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username === null) Navigate("/");
        const [userRes, rateRes] = await Promise.all([
          axios.get(`https://api.github.com/users/${username}`),
          axios.get(`https://api.github.com/rate_limit`),
        ]);

        setUserData(userRes.data);
        setRateLimit({
          remaining: rateRes.data.rate.remaining,
          limit: rateRes.data.rate.limit,
        });
      } catch (error) {
        console.error("GitHub API error:", error);
      }
    };

    fetchData();
  }, [username, Navigate]);

  const joinedDate = userData
    ? new Date(userData.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const { data } = await axios.get(
          `https://api.github.com/users/${username}/repos?per_page=100`
        );
        const sorted = data.sort(
          (a: { stargazers_count: number }, b: { stargazers_count: number }) => b.stargazers_count - a.stargazers_count
        );
        setRepos(sorted);
      } catch (err) {
        console.error("Error fetching repos:", err);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `https://api.github.com/users/${username}`
        );
        setStats({
          avatar_url: res.data.avatar_url,
          login: res.data.login,
          created_at: res.data.created_at,
          public_repos: res.data.public_repos,
          followers: res.data.followers,
          following: res.data.following,
        });
      } catch (error) {
        console.error("GitHub Stats Error:", error);
      }
    };

    fetchStats();
  }, [username]);

  const languageColor = (lang: string) => {
    switch (lang) {
      case "JavaScript":
        return "bg-yellow-400";
      case "CSS":
        return "bg-purple-600";
      case "HTML":
        return "bg-orange-500";
      case "Python":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };
  if (!userData) return <div className="text-white p-4">Loading...</div>;
  if (!stats) return null;
  return (
    <div className="min-h-screen  text-white flex flex-col items-center  ">
      <div className="h-[72vh] w-full flex flex-col items-center justify-center bg-[linear-gradient(to_bottom,rgba(100,0,0,0.7),rgba(0,0,0,1)),url('/github1.webp')] bg-cover bg-center text-white">
        <div className="text-sm sm:text-base text-zinc-300 mb-1">
          {rateLimit.remaining} / {rateLimit.limit}
        </div>
        <div className="text-xs sm:text-sm text-zinc-300 mb-4">
          REQUESTS LEFT
        </div>

        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-blue-600">
          <AvatarImage src={stats.avatar_url} alt="Profile" />
          <AvatarFallback>
            {stats.login.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-xl sm:text-2xl font-bold mt-3 text-blue-400">
          @{stats.login}
        </h1>

        <div className="flex items-center text-zinc-200 mt-2 text-sm sm:text-base">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Joined {joinedDate}
        </div>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Card className="bg-zinc-900/80 text-center w-36 sm:w-28 shadow-md">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-white">
                {stats.public_repos}
              </div>
              <div className="text-xs text-zinc-400 mt-1">REPOSITORIES</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/80 text-center w-36 sm:w-28 shadow-md">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-white">
                {stats.followers}
              </div>
              <div className="text-xs text-zinc-400 mt-1">FOLLOWERS</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/80 text-center w-36 sm:w-28 shadow-md">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-white">
                {stats.following}
              </div>
              <div className="text-xs text-zinc-400 mt-1">FOLLOWING</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
        <Chart />
      
      {/* Data Cards */}
      {/* <Chart username="joshi232004manish" repo="shelter_seeker" /> */}
      {/* <Language username="joshi232004manish" repo="shelter_seeker" /> */}

      <div className="bg-[rgb(0,0,0)] min-h-screen p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-4xl pt-3 pb-6 text-blue-400 text-center font-semibold">
            Top Repos
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
          {repos.map((repo) => (
            <Card
              key={repo.id}
              className="p-4 border-none flex flex-col justify-between transition-transform duration-380 hover:-translate-y-2 hover:opacity-80 shadow-md bg-[rgb(35,34,34)]"
            >
              <h2 className="font-mono text-[rgb(155,150,150)] font-bold text-lg flex items-center gap-2">
                <span className="text-xl">📘</span>
                {repo.name}
              </h2>
              <p className="text-sm text-[rgb(108,107,107)] mt-2">
                {repo.description || "No description"}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${languageColor(
                      repo.language
                    )}`}
                  ></span>
                  <span>{repo.language || "N/A"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" /> {repo.forks_count}
                  </span>
                </div>
                <span>{(repo.size / 1024).toFixed(0)} KB</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
