import '../styles/default.css'

function header() {
    return (
        <header>
            <nav>
                <img src={"/coin.png"} alt="Icone Moeda" className="icon"/>
                <h3>Sistema de Moeda Estudantil</h3>
            </nav>
        </header>
    )
}
export default header