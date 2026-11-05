
import { sampleFlights } from './features/flights/data/sample-flights';
import { FlightList } from './features/flights/FlightList';


export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong>Skyline</strong>
        <span>flights, simplified</span>
      </header>
      <main className="content">
        {/* <p>Hello, Skyline</p> */}
        {/* <Button variant="ghost">Teste</Button> */}
        {/* <RevisaoPage /> */}

        <FlightList 
          flights={sampleFlights}
          basket={{5: true, 8: true}}
          onToggle={(flightId, selected) => console.log(flightId, selected)}
        />
      </main>
    </div>
  );
}