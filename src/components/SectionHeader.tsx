import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  kicker?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  className?: string;
  invert?: boolean;
};

const SectionHeader = ({
  kicker,
  title,
  lead,
  aside,
  className,
  invert = false,
}: SectionHeaderProps) => {
  return (
    <div className={cn("section-header", invert && "section-header-dark", className)}>
      <div className="section-header-copy">
        {kicker ? <p className="section-kicker">{kicker}</p> : null}
        <h2 className="section-heading mt-4">{title}</h2>
        {lead ? <p className="section-lead max-w-2xl">{lead}</p> : null}
      </div>
      {aside ? <div className="section-header-aside">{aside}</div> : null}
    </div>
  );
};

export default SectionHeader;
