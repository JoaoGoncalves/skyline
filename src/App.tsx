import { FlightSearch } from './features/flights/FlightSearch';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong>Skyline</strong>
        <span>flights, simplified</span>
      </header>
      <main className="content">
        <FlightSearch />
      </main>
    </div>
  );
}
