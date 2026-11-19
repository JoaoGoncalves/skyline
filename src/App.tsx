import { NavLink, Outlet } from 'react-router';
import { AppShell } from './ui/AppShell';

export default function App() {
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
      <Outlet />
   </AppShell>
  );
}
