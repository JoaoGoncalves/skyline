import { Link } from 'react-router';
import { Panel } from '../ui/Panel';

export function NotFoundPage() {
  return (
    <Panel title="404 · Page not found">
      <p className="empty">This page doesn't exist.</p>
      <Link to="/flights">← Back to flights</Link>
    </Panel>
  );
}