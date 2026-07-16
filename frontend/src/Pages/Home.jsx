import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "../Lib/utils";
import {
  ArrowRight,
  ArrowDownRight,
  Wallet,
  PieChart,
  Bell,
  Target,
  ShieldCheck,
  Link2,
  Sparkles,
  Coffee,
  Car,
  ShoppingBag,
  Home as HomeIcon,
  Lock,
  Fingerprint,
  Star,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Brand marks — lucide-react 1.0 removed all brand/logo icons, so these are
// small inline SVGs instead of a new dependency.
// ---------------------------------------------------------------------------
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-6.7L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.1L18.9 2zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20z" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.55 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Animated count-up number, respects prefers-reduced-motion
// ---------------------------------------------------------------------------
function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    let raf;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ---------------------------------------------------------------------------
// Ledger strip — recurring structural device: timestamped dotted divider
// ---------------------------------------------------------------------------
function LedgerStrip({ label }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70">
      <span className="h-px flex-1 bg-[repeating-linear-gradient(90deg,currentColor_0,currentColor_3px,transparent_3px,transparent_9px)] text-border" />
      <span className="shrink-0">{label}</span>
      <span className="h-px flex-1 bg-[repeating-linear-gradient(90deg,currentColor_0,currentColor_3px,transparent_3px,transparent_9px)] text-border" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero "live ledger" preview card
// ---------------------------------------------------------------------------
function LedgerCard() {
  const spent = useCountUp(1559.5, { decimals: 2 });

  const rows = [
    {
      icon: Coffee,
      name: "Blue Bottle Coffee",
      cat: "Food & Drink",
      amt: -6.4,
    },
    { icon: HomeIcon, name: "Rent — August", cat: "Housing", amt: -1450 },
    { icon: ShoppingBag, name: "Grocery run", cat: "Groceries", amt: -84.2 },
    { icon: Car, name: "Uber", cat: "Transport", amt: -18.9 },
  ];

  return (
    <div className="relative w-full max-w-sm">
      {/* ambient glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[oklch(0.62_0.15_150)]/10 blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.22_0.06_255)] shadow-2xl shadow-black/40">
        {/* header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
              Spent this month
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold text-white tabular-nums">
              ${spent}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[oklch(0.62_0.15_150)]/15 px-2.5 py-1 font-mono text-xs font-medium text-[oklch(0.75_0.16_150)]">
            <ArrowDownRight className="h-3 w-3" />
            −12% vs last month
          </span>
        </div>

        {/* mini sparkline */}
        <svg
          viewBox="0 0 300 60"
          className="mt-3 w-full px-5"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,10 30,14 60,18 90,16 120,26 150,24 180,36 210,32 240,44 270,42 300,52"
            fill="none"
            stroke="oklch(0.65 0.15 150)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mx-5 mt-4 h-px bg-white/10" />

        {/* transaction feed */}
        <div className="flex flex-col divide-y divide-white/10 px-2 py-2">
          {rows.map(({ icon: Icon, name, cat, amt }, i) => (
            <div
              key={name}
              className="flex items-center gap-3 px-3 py-2.5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${400 + i * 140}ms` }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                <Icon className="h-3.5 w-3.5 text-white/60" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white/90">
                  {name}
                </p>
                <p className="text-[11px] text-white/40">{cat}</p>
              </div>
              <span className="shrink-0 font-mono text-[13px] tabular-nums text-white/70">
                -${Math.abs(amt).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature bento item
// ---------------------------------------------------------------------------
function FeatureCard({
  icon: Icon,
  title,
  desc,
  className,
  accent = "primary",
}) {
  const accentClasses = {
    primary: "bg-primary/10 text-primary ring-primary/15",
    green:
      "bg-[oklch(0.62_0.15_150)]/10 text-[oklch(0.48_0.13_150)] ring-[oklch(0.62_0.15_150)]/15",
    amber:
      "bg-[oklch(0.78_0.14_80)]/15 text-[oklch(0.48_0.12_80)] ring-[oklch(0.78_0.14_80)]/20",
  };

  return (
    <Card
      className={cn(
        "group border-border/50 bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)]",
        className,
      )}
    >
      <CardHeader className="gap-3.5 p-5">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl ring-1",
            accentClasses[accent],
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <CardTitle className="font-sans text-[15px] font-semibold tracking-tight text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-[13.5px] leading-relaxed text-muted-foreground">
          {desc}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const Home = ()=> {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------------- Header ---------------- */}

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(0.85 0.01 255) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 30% 20%, black, transparent)",
          }}
        />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 rounded-full border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="h-3 w-3" />
              Now with automatic categorization
            </Badge>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Know exactly where
              <br />
              <span className="text-primary">your money goes.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              finTrack logs every expense the moment it happens — where it went,
              what category it's in, and how it compares to last month. No
              spreadsheets, no guesswork.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 rounded-full px-6 shadow-lg shadow-primary/20",
                )}
              >
                Start tracking free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full px-6",
                )}
              >
                See how it works
              </Link>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Free for individuals · No credit card required
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <LedgerCard />
          </div>
        </div>
      </section>

      {/* ---------------- Stat strip (ledger device) ---------------- */}
      <section className="border-y border-border/60 bg-muted/30 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <LedgerStrip label="Since 2024" />
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "$18M+", label: "Expenses logged" },
              { value: "38K+", label: "Active users" },
              { value: "4.9/5", label: "Average rating" },
              { value: "128", label: "Banks connected" },
            ].map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="font-mono text-2xl font-semibold tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your money needs,
            <br />
            nothing it doesn't.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six tools that work together quietly in the background, so the only
            thing you have to do is glance and know.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={PieChart}
            title="Automatic categorization"
            desc="Every purchase is sorted the moment it clears — groceries, rent, subscriptions — no manual tagging."
            accent="primary"
          />
          <FeatureCard
            icon={Target}
            title="Spending limits per category"
            desc="Set a monthly cap for eating out or transport and see exactly how close you are, in real time."
            accent="green"
          />
          <FeatureCard
            icon={Bell}
            title="Spending alerts"
            desc="A nudge before you go over a category limit, not a report after you already did."
            accent="amber"
          />
          <FeatureCard
            icon={Link2}
            title="Every account, one view"
            desc="Every card and account you spend from syncs in real time — no more tab-switching to know your total."
            accent="primary"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Bank-level encryption"
            desc="256-bit encryption and read-only access. finTrack can see your data — it can never move your money."
            accent="green"
          />
          <FeatureCard
            icon={Wallet}
            title="Recurring expense tracking"
            desc="Subscriptions and bills are flagged automatically, so nothing quietly drains your account unnoticed."
            accent="amber"
          />
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how-it-works" className="bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps. Then it runs itself.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                time: "Day 1",
                title: "Connect your accounts",
                desc: "Securely link banks and cards in under two minutes — read-only, always.",
              },
              {
                time: "Day 1",
                title: "Watch it categorize itself",
                desc: "finTrack sorts your history and every new transaction automatically.",
              },
              {
                time: "Ongoing",
                title: "Check in, not catch up",
                desc: "One glance tells you what you've spent and where — no end-of-month surprise.",
              },
            ].map((step) => (
              <div key={step.title}>
                <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  {step.time}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Security ---------------- */}
      <section id="security" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your data is read-only.
              <br />
              Your money stays yours.
            </h2>
            <p className="mt-4 text-muted-foreground">
              finTrack connects through the same encrypted infrastructure banks
              use to talk to each other. We can show you your money. We can
              never move it.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {[
                { icon: Lock, text: "256-bit AES encryption, end to end" },
                {
                  icon: Fingerprint,
                  text: "Biometric app lock on every device",
                },
                {
                  icon: ShieldCheck,
                  text: "SOC 2 Type II certified infrastructure",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.62_0.15_150)]/10 text-[oklch(0.5_0.13_150)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-foreground/90">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-border/60 bg-muted/30 p-8 shadow-sm">
            <div className="flex items-center gap-1 text-[oklch(0.7_0.15_80)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
              "I stopped wondering where my paycheck went. finTrack shows every
              expense the moment it happens — it's the first tracker that didn't
              feel like homework."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary">
                HA
              </div>
              <div>
                <p className="text-sm font-medium">Hodan Aweys</p>
                <p className="text-xs text-muted-foreground">
                  Product designer, Mogadishu
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[oklch(0.22_0.06_255)] px-8 py-16 text-center sm:px-16">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start seeing the full picture today.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-white/60">
            Set up takes under two minutes. Cancel anytime — your data leaves
            with you.
          </p>
          <Button
            size="lg"
            className="relative mt-8 gap-2 rounded-full bg-white px-7 text-[oklch(0.22_0.06_255)] hover:bg-white/90"
          >
            Create your free account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {/* Brand row — logo/tagline bidix, social icons midig */}
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3">
              <Link to="/home" className="flex w-fit items-center gap-2">
                <img
                  src="/Logo.png"
                  alt="finTrack"
                  className="h-8 w-8 rounded-lg object-contain"
                />
                <span className="text-[15px] font-bold tracking-tight">
                  finTrack
                </span>
              </Link>
              <p className="max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
                Every expense, logged the moment it happens. No spreadsheets, no
                guesswork.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[
                { icon: XIcon, label: "X / Twitter", href: "#" },
                { icon: GithubIcon, label: "GitHub", href: "#" },
                { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12">
            <LedgerStrip label="finTrack" />
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} finTrack. All rights reserved.
              </p>
              <p className="font-mono text-xs text-muted-foreground/70">
                Made with care · Mogadishu
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;