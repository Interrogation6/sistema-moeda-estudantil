import '../styles/default.css'

function header() {
    return (
        <>
            <header style={{height: '2em'}}>
                <nav style={{marginTop: '0.4em'}}>
                    <img src={"/coin.png"} alt="Icone Moeda" className="icon"/>
                    <h3>Sistema de Moeda Estudantil</h3>
                </nav>
            </header>
            <div style={{height: '2.5em'}}/>
        </>
    )
}
export default header