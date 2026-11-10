import type { ReactNode } from "react";

type AppShellProps = {
  brand: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppShell({ brand, actions, children }: AppShellProps) {
  return (
    <div className="app">
        <header className="topbar">
            <strong>{brand}</strong>
            {actions}
        </header>
        <main className="content">{children}</main>
    </div>
  );
}
