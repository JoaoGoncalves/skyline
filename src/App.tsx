import { NavLink, Outlet, useNavigation } from 'react-router';
import { AppShell } from './ui/AppShell';

export default function App() {

  const navigation = useNavigation();
  const busy = navigation.state === 'loading';

  return (
   <AppShell brand='Skyline' actions={
    <>
      <span>flights, simplified</span>
      <nav className='nav'>
        <NavLink to='/flights'>Flights</NavLink>
        <NavLink to='/about'>About</NavLink>
      </nav>
    </>
   }>
    <div className={busy ? 'busy' : undefined}>
      <Outlet />
    </div>
   </AppShell>
  );
}
