import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 md:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  onClick,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
  onClick?: () => void;
  cta: string;
}) => (
  <div
    key={name}
    onClick={onClick}
    className={cn(
      "group relative flex flex-col p-6 bg-white dark:bg-white/[.02] rounded-xl",
      "border border-gray-200 dark:border-gray-800",
      "[box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "transform-gpu transition-all duration-300",
      "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700",
      "cursor-pointer",
      className,
    )}
  >
    <div className="mb-4">
      <Icon className="h-12 w-12 text-gray-600 dark:text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {name}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm">
      {description}
    </p>
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="sm" className="p-0 h-auto font-normal">
        {cta}
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
