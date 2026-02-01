import { auth } from '@/lib/auth';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <Navlinks user={user} />
      </div>
    </nav>
  );
}
