import { Button } from "./ui/Button";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong>Skyline</strong>
        <span>flights, simplified</span>
      </header>
      <main className="content">
        <p>Hello, Skyline</p>
        <Button variant="ghost">Teste</Button>
      </main>
    </div>
  );
}