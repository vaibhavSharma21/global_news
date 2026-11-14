
function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h2>GLOBAL<span>NEWS</span></h2>
            </div>

            <div className="navbar-links">
                <a href="#">Home</a>
                <a href="#">World</a>
                <a href="#">Business</a>
                <a href="#">Technology</a>
                <a href="#">Sports</a>
            </div>

            <div className="navbar-search">
                <button>Search</button>
            </div>
        </nav>
    );
}

export default Navbar;
