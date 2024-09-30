function Header() {
    return (
        <>
            <div className="bg-grey">
                <div className="navbar container mx-auto">
                    <div className="navbar-start">
                        <a className="btn btn-ghost text-xl">LOGO</a>
                        <ul className="menu menu-horizontal px-1 hidden lg:flex">
                            <li><a>Find Talent</a></li>
                            <li><a>Find Work</a></li>
                            <li><a>Why Us?</a></li>
                        </ul>
                    </div>
                    <div className="navbar-end gap-5">
                        <a className="btn bg-greenPrimary border-none">Sign-Up</a>
                        <a className="btn bg-greenPrimary border-none">Login</a>
                    </div>
                </div>
            </div>
        </>
    );
} 
export default Header