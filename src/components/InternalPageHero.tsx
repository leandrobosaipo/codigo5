import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type InternalPageHeroProps = {
  kicker: string;
  title: string;
  lead: string;
  eyebrow?: string;
  highlights?: string[];
  stats?: Array<{ value: string; label: string }>;
  aside?: ReactNode;
  visual?: ReactNode;
};

const InternalPageHero = ({
  kicker,
  title,
  lead,
  eyebrow,
  highlights = [],
  stats = [],
  aside,
  visual,
}: InternalPageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(27,213,255,0.14),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(255,124,77,0.16),transparent_18%),linear-gradient(180deg,#07111f_0%,#0b1730_100%)] py-12 text-white sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.07]" />
      <div className="absolute left-[-8rem] top-[4rem] h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-[-5rem] top-[8rem] h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

      <div className="container relative z-10">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_38px_120px_-70px_rgba(0,0,0,0.8)] backdrop-blur sm:rounded-[34px] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10">
            <div className="max-w-2xl">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-100/84">
                  {kicker}
                </span>
              </Reveal>

              {eyebrow ? (
                <Reveal delay={40}>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {eyebrow}
                  </p>
                </Reveal>
              ) : null}

              <Reveal
                as="h1"
                delay={80}
                className="mt-4 font-display text-4xl font-semibold leading-[0.94] text-white sm:text-5xl lg:text-[5.35rem]"
              >
                {title}
              </Reveal>

              <Reveal
                as="p"
                delay={140}
                className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8"
              >
                {lead}
              </Reveal>

              {highlights.length ? (
                <Reveal className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2" delay={190}>
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-[18px] border border-white/10 bg-black/14 px-4 py-3 text-sm leading-6 text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </Reveal>
              ) : null}
            </div>

            <div className="grid gap-3 sm:gap-4">
              {visual ? (
                <Reveal delay={110}>
                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/6 p-3 shadow-[0_32px_90px_-62px_rgba(0,0,0,0.72)] sm:rounded-[30px] sm:p-4">
                    {visual}
                  </div>
                </Reveal>
              ) : null}

              {stats.length ? (
                <Reveal className="grid gap-3 sm:grid-cols-3" delay={140}>
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4 sm:rounded-[24px] sm:px-5"
                    >
                      <p className="font-display text-2xl font-bold text-white sm:text-3xl">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.label}</p>
                    </div>
                  ))}
                </Reveal>
              ) : null}

              {aside ? (
                <Reveal delay={220}>
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-200 sm:rounded-[28px] sm:p-5">
                    {aside}
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternalPageHero;
