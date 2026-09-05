import { useEffect, useState } from "react";

export default function Inicio() {
  const [equipos, setEquipos] = useState([]);
  const [characters, setPersonajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [board, setBoard] = useState(Array(28).fill(null));
  const [selectedTeam, setSelectedTeam] = useState(equipos[0]?.id_equipo || "");
  const [sinergiasActivas, setActiveSinergies] = useState([]);

  const API = {
    equipos: {
      list: "http://localhost/BackendReact/TeamBuildingProyect/controllers/equipos/data_teams.php",
      create: "http://localhost/BackendReact/TeamBuildingProyect/controllers/equipos/add_team.php",
      edit: "http://localhost/BackendReact/TeamBuildingProyect/controllers/equipos/edit_team.php",
      delete: "http://localhost/BackendReact/TeamBuildingProyect/controllers/equipos/delete_team.php",
    },
    characters: {
      list: "http://localhost/BackendReact/TeamBuildingProyect/controllers/personajes/data_characters.php"
    },
  };

  useEffect(() => {
    fetch(API.equipos.list)
      .then((res) => res.json())
      .then((data) => {
        setEquipos(data);
      })
      .catch((error) => {
        console.error("Error al cargar equipos:", error);
      });
    fetch(API.characters.list)
      .then((res) => res.json())
      .then((data) => {
        setPersonajes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar equipos:", error);
        setLoading(false);
      });
  }, [reload]);

  useEffect(() => {
    calculateSinergies();
  }, [board]);

  const addTeam = async () => {
    const { value: name } = await Swal.fire({
      title: "Añadir sinergia",
      input: "text",
      inputLabel: "Nombre del sinergia",
      inputPlaceholder: "Introduce un nombre",
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
    });

    if (!name) return;

    const formData = new FormData();
    formData.append("nombre", name);

    await fetch(API.equipos.create, {
      method: "POST",
      body: formData,
    });

    setReload(!reload);
  };

  const selectTeam = (id_equipo) => {
    const team = equipos.find(e => e.id_equipo == id_equipo);
    setSelectedTeam(id_equipo);
    buildTeamFromCharacters(team);
  };

  const buildTeamFromCharacters = (equipo) => {
    const newBoard = [];

    for (let i = 1; i <= 28; i++) {
      const id = equipo[`id_p_${i}`];
      const foto = equipo[`foto_${i}`];

      newBoard.push(
        id
          ? { id_personaje: id, ruta_foto: foto }
          : null
      );
    }

    setBoard(newBoard);
  };

  const selectCharacterForSlot = async (index) => {
    const opciones = {};

    characters.forEach((p) => {
      opciones[p.id_personaje] = p.nombre;
    });

    const actualSlot = board[index];

    const result = await Swal.fire({
      title: "Acción en la casilla",
      showCancelButton: true,
      showDenyButton: !!actualSlot,
      confirmButtonText: "Asignar personaje",
      denyButtonText: "Eliminar personaje",
      cancelButtonText: "Cancelar",
      input: "select",
      inputOptions: opciones,
      inputPlaceholder: "Elige un personaje",
      inputValidator: (value) => {
        if (!value && accion === "confirm") {
          return "Debes seleccionar un personaje";
        }
      }
    });

    const action = result.isConfirmed ? "asignar"
      : result.isDenied ? "eliminar"
        : "cancelar";

    if (action == "cancelar") return;

    if (action === "eliminar") {
      const newBoard = [...board];
      newBoard[index] = null;
      setBoard(newBoard);
      return;
    }

    const selectedId = Swal.getInput().value;
    if (!selectedId) return;

    const character = characters.find(p => p.id_personaje == selectedId);

    const newBoard = [...board];
    newBoard[index] = {
      id_personaje: character.id_personaje,
      ruta_foto: character.ruta_foto
    };

    setBoard(newBoard);
  };

  const prepareDataToSave = () => {
    const data = {};

    for (let i = 0; i < 28; i++) {
      const slot = board[i];

      data[i + 1] = slot ? slot.id_personaje : 0;
    }

    return data;
  };

  const saveTeam = async () => {
    const positions = prepareDataToSave();

    const body = {
      id_equipo: selectedTeam,
      posiciones: positions
    };

    const res = await fetch(API.equipos.edit, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    Swal.fire({
      icon: "success",
      title: "Equipo guardado",
      text: "Las posiciones se han actualizado correctamente"
    });

    setReload(!reload);
  };

const calculateSinergies = () => {
  const contador = {};

  board.forEach(slot => {
    if (!slot) return;

    const character = characters.find(p => p.id_personaje == slot.id_personaje);
    if (!character) return;

    character.sinergias.forEach(s => {
      if (!contador[s.id_sinergia]) {
        contador[s.id_sinergia] = {
          id: s.id_sinergia,
          nombre: s.nombre_sinergia,
          foto: s.foto_sinergia,
          cantidad: 0
        };
      }

      contador[s.id_sinergia].cantidad++;
    });
  });

  setActiveSinergies(Object.values(contador));
};


  const deleteTeam = async () => {
    const body = {
      id_equipo: selectedTeam
    };

    const res = await fetch(API.equipos.delete, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    Swal.fire({
      icon: "success",
      title: "Equipo eliminado",
      text: "Equipo eliminado correctamente"
    });

    setReload(!reload);
  }


  return (
    <div className="inicio-container">

      <div className="equipo-bar">
        <select
          className="equipo-select"
          onChange={(e) => selectTeam(e.target.value)}
        >
          <option value="">Selecciona un equipo...</option>

          {equipos.map((eq) => (
            <option key={eq.id_equipo} value={eq.id_equipo}>
              {eq.nombre}
            </option>
          ))}
        </select>

        <button className="btn-tft" onClick={addTeam}>Nuevo equipo</button>
        <button className="btn-tft" onClick={saveTeam}>Guardar equipo</button>
        <button className="btn-tft" onClick={deleteTeam}>Eliminar</button>
      </div>

      <div className="inicio-layout">

        <aside className="panel-sinergias">
          <h2>Sinergias activas</h2>

          {sinergiasActivas.map(s => (
            <div key={s.id} className="sinergia-item">
              <span className="sinergia-nombre">{s.nombre}</span>
              <span className="sinergia-contador">{s.cantidad}</span>
            </div>
          ))}
        </aside>

        <main className="tablero">
          {board.map((slot, i) => (
            <div
              key={i}
              className="casilla"
              onClick={() => selectCharacterForSlot(i)}
            >
              {slot?.ruta_foto ? (
                <img
                  src={"http://localhost/BackendReact/TeamBuildingProyect/Images/" + slot.ruta_foto}
                  className="personaje-img"
                />
              ) : (
                i + 1
              )}
            </div>
          ))}
        </main>

      </div>
    </div>
  );
}
