import { tw } from 'twind';
import { useState } from 'react';
import Button from '@/components/button';
import Link from 'next/link';
import { ContractsLink } from '@/constants/constants';

interface IMenuButton {
  toggleMenu: React.MouseEventHandler<HTMLButtonElement>;
  showMenu: boolean;
}

type Link = {
  label: string;
  href: string;
};

const links: any[] = [
  // {
  //   label: `Features`,
  //   href: `/`,
  // },
  // {
  //   label: `Testimonials`,
  //   href: `/`,
  // },
  // {
  //   label: `Pricing`,
  //   href: `/`,
  // },
  // {
  //   label: `Blog`,
  //   href: `/`,
  // },
];

const secondaryLinks = [
  // {
  //   label: `Contact sales`,
  //   href: `/`,
  // },
  // {
  //   label: `Log in`,
  //   href: `/`,
  // },
  {
    label: `Get Started`,
    href: `/`,
  },
];

const MenuButton = ({ toggleMenu, showMenu }: IMenuButton) => (
  <button
    type="button"
    aria-controls="mobile-menu"
    aria-expanded={showMenu}
    onClick={toggleMenu}
    className={tw(`p-2 text-gray-400`)}
  >
    <span className={tw(`sr-only`)}>Open menu</span>
    {showMenu ? (
      <svg
        className={tw(`h-6 w-6`)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        width={24}
        height={24}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      <svg
        className={tw(`h-6 w-6`)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        width={24}
        height={24}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
);

const MobileMenu = () => (
  <div className={tw(`md:hidden`)}>
    <div className={tw(`px-2 pt-2 pb-3 space-y-1 sm:px-3`)}>
      {links.map((link: Link) => (
        <a href={link.href} className={tw(`text-gray-500 block px-3 py-2 text-base font-medium`)} key={link.label}>
          {link.label}
        </a>
      ))}
    </div>
    <div className={tw(`pt-4 pb-3 border-t border-gray-400`)}>
      <div className={tw(`px-2 space-y-1`)}>
        {/* {secondaryLinks.map((link: Link) => (
          <a
            key={`mobile-${link.label}`}
            href={link.href}
            className={tw(`block px-3 py-2 text-base font-medium text-gray-500`)}
          >
            {link.label}
          </a>
        ))} */}
      </div>
    </div>
  </div>
);
interface INavigation {
  isApp? : boolean
}
const Navigation = ({isApp} : INavigation) => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <nav className={tw(`bg-white`)}>
      <div className={tw(`max-w-auto mx-auto px-4 sm:px-6 lg:px-8`)}>
        <div className={tw(`flex items-center justify-between h-24`)}>
          <div className={tw(`flex items-center flex-row`)}>
            <a href={"https://dca.cash"}>
            <div className={tw(`flex flex-row`)}>
            <div className={tw(`pt-3`)}>
            <h1
              className={tw(`font-sans font-bold text-4xl md:text-5xl lg:text-4xl text-center leading-snug text-black`)}
            >
              dca.
            </h1>
            </div>
            <div className={tw(`flex-shrink-0`)}>
              <img className={tw(`h-17 w-17`)} src="dollar.png" alt="logo" width={60} height={60} />
            </div>
            </div>
            </a>
            <div className={tw(`hidden md:block`)}>
              <div className={tw(`ml-10 flex items-baseline space-x-4`)}>
                {links.map((link: Link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className={tw(`text-secondary hover:text-primary px-3 py-2 rounded-md font-large`)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className={tw(`hidden md:block`)}>
            <div className={tw(`ml-4 flex items-center md:ml-6`)}>
              {/* <Button modifier="border-0 mr-2">Contact sales</Button>
              <Button modifier="border-0 mr-2">Log in</Button> */}
              
              {!isApp && <a target='_blank' rel="noopener noreferrer" href={ContractsLink}><Button modifier="border-0 mr-2">Contracts ↗</Button></a>}
              {!isApp && <Link href={"/app"}><Button primary >Try our Polygon beta</Button></Link>}
            </div>
          </div>
          <div className={tw(`-mr-2 flex md:hidden`)}>
            <MenuButton showMenu={showMenu} toggleMenu={toggleMenu} />
          </div>
        </div>
      </div>
      {showMenu ? <MobileMenu /> : null}
    </nav>
  );
};

export default Navigation;
