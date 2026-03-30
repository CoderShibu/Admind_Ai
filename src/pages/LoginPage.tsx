import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate loading
    if (email === "admin@123" && password === "adminhere") {
      localStorage.setItem("nagent_auth", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password. Use admin@123 / adminhere");
    }
    setIsLoading(false);
  };

  const handleDemo = () => {
    localStorage.setItem("nagent_auth", "true");
    navigate("/dashboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 animate-gradient-mesh"
        style={{
          background: "linear-gradient(-45deg, hsl(228 78% 8%), hsl(228 60% 14%), hsl(270 60% 20%), hsl(191 80% 15%), hsl(228 78% 8%))",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card relative z-10 w-full max-w-md p-8"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 glow-cyan">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Admind AI</h1>
          <p className="text-sm text-muted-foreground">Performance Marketing Intelligence</p>
        </div>

        {/* Form */}
        <div className="space-y-4" onKeyDown={handleKeyDown}>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              placeholder="team@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border/50 bg-secondary/50 input-glow"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border/50 bg-secondary/50 pr-10 input-glow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card/50 px-2 text-muted-foreground">or</span></div>
          </div>

          <Button
            variant="outline"
            onClick={handleDemo}
            className="w-full border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
          >
            Enter Demo Mode
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
