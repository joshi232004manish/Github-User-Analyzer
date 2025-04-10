import { Input } from "@/components/ui/input";
import { GithubIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDialogContext } from "@/store/userContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OctoProfileSearch() {
  const navigate = useNavigate();
  const { user, setUser } = useDialogContext();
  const handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate("/profile");
    console.log(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 px-4">
      <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">
        <GithubIcon className="text-blue-600 w-12 h-12" />
        <h1 className="text-3xl font-semibold text-white">
          Audit Your GitHub Profile
        </h1>
        <Input
          placeholder="Enter GitHub username"
          onChange={(e) => {
            setUser(e.target.value); 
            console.log(user);
          }}
          
          className={cn(
            "bg-zinc-800 text-white placeholder:text-zinc-400 border border-zinc-700 focus:ring-blue-500 focus:border-blue-500 rounded-md"
          )}
        />
        <Button onClick={handleSumbit} className="bg-blue-700">Click Me</Button>
      </div>
    </div>
  );
}
