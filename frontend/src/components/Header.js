import NavBar from "./NavBar";

function Header({ email, onHamburgerClick, isOpen, onLogOut }) {
  return (
      <header className="header">
          <div className="logo"></div>
          <NavBar
              email={email}
              isOpen={isOpen}
              onHamburgerClick={onHamburgerClick}
              onLogOut={onLogOut}
          />
      </header>
  );
}

export default Header;
