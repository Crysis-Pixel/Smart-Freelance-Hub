import {Link} from 'react-router-dom'
function Header() {
    return (
        <>
            <div className="bg-grey">
                <div className="navbar container mx-auto">
                    <div className="navbar-start">
                        <Link to='/home'>LOGO</Link>
                        <ul className="menu menu-horizontal px-1 hidden lg:flex">
                            <li><a>Find Talent</a></li>
                            <li><a>Find Work</a></li>
                            <li><a>Why Us?</a></li>
                        </ul>
                    </div>
                    <div className="navbar-end gap-5">
                        <Link to='/signup' className="btn bg-greenPrimary border-none">Sign-Up</Link>
                        <Link to='/login' className="btn bg-greenPrimary border-none">Login</Link>
                        <Link to='/profile'>
                        <div className="avatar">        
                            <div className="ring-primary ring-offset-base-100 w-12 rounded-full">
                                <img src="https://via.placeholder.com/50" />
                             </div>
                        </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
} 
export default Header