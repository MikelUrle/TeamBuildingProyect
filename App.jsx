import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Personajes from "./pages/Personajes";
import Sinergias from "./pages/Sinergias";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div id="divGeneral">

        <aside className="menuAside">
          <ul style={{ listStyle: "none"}}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/personajes">Personajes</Link></li>
            <li><Link to="/sinergias">Sinergias</Link></li>
          </ul>
        </aside>

        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/personajes" element={<Personajes />} />
            <Route path="/sinergias" element={<Sinergias />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}
