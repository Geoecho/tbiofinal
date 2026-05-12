import { useState } from "react";
import { useLocation } from "wouter";
import { adminLogin, isAdminLoggedIn } from "@/lib/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import logoImg from "@/assets/logo.png";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdminLoggedIn()) {
    setLocation("/admin/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (adminLogin(pw)) {
        setLocation("/admin/dashboard");
      } else {
        setError("Incorrect password. Try again.");
        setPw("");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-foreground text-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-10">
          <img
            src={logoImg}
            alt="The Big Impact Organization"
            className="h-14 brightness-0 invert"
          />
        </div>

        <div className="border-4 border-background/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary">
              <Lock size={20} className="text-white" />
            </div>
            <h1 className="font-display text-2xl uppercase tracking-widest">Admin Panel</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold uppercase tracking-widest text-xs text-background/60 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                className="bg-background/10 border-2 border-background/30 text-background placeholder:text-background/30 rounded-none h-12 focus-visible:ring-0 focus-visible:border-primary"
                autoFocus
              />
              {error && (
                <p className="text-primary text-sm font-bold mt-2">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!pw || loading}
              className="w-full font-display uppercase tracking-widest text-lg py-6 border-2 border-background/30 disabled:opacity-40"
            >
              {loading ? "Checking..." : "Enter"}
            </Button>
          </form>
        </div>

        <p className="text-center text-background/30 text-xs mt-6 font-medium uppercase tracking-widest">
          The Big Impact Organization — Admin
        </p>
      </div>
    </div>
  );
}
