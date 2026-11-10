import { FlightSearch } from './features/flights/FlightSearch';
import { AppShell } from './ui/AppShell';

export default function App() {
  return (
   <AppShell brand='Skyline' actions={<span>flights, simplified</span>}>
      <FlightSearch />
   </AppShell>
  );
}
