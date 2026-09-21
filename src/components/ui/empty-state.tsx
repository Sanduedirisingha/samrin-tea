import type { ReactNode } from "react";

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border-line bg-ivory mx-auto max-w-md rounded-2xl border px-6 py-14 text-center">
      <h2 className="text-forest text-2xl">{title}</h2>
      {children && <p className="text-muted mt-3">{children}</p>}
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}
