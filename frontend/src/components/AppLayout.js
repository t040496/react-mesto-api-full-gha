import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import HamburgerMenu from "./HamburgerMenu";

function AppLayout({ email, isOpen, onHamburgerClick, onLogOut }) {
    return (
        <>
            <HamburgerMenu
                email={email}
                isOpen={isOpen}
                onLogOut={onLogOut}
            />
            <Header
                email={email}
                isOpen={isOpen}
                onHamburgerClick={onHamburgerClick}
                onLogOut={onLogOut}
            />
            <Outlet />
            <Footer />
        </>
    )
}

export default AppLayout;
