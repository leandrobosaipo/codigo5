import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionFrameProps = {
  children: ReactNode;
  className?: string;
  dark?: boolean;
};

const SectionFrame = ({ children, className, dark = false }: SectionFrameProps) => {
  return (
    <div className={cn(dark ? "section-frame-dark" : "section-frame", className)}>
      {children}
    </div>
  );
};

export default SectionFrame;
