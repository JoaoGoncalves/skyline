import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="panel">
      <header className="panel-header">
        <h2>{title}</h2>
        {actions}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}

