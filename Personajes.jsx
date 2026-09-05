import { useEffect, useState } from "react";

export default function Personajes() {
  const [personajes, setPersonajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [arrayOfSinergies, setSinergiasDisponibles] = useState([]);

  const API = {
    personajes: {
      list: "http://localhost/BackendReact/TeamBuildingProyect/controllers/personajes/data_characters.php",
      create: "http://localhost/BackendReact/TeamBuildingProyect/controllers/personajes/add_character.php",
      edit: "http://localhost/BackendReact/TeamBuildingProyect/controllers/personajes/edit_character.php",
      delete: "http://localhost/BackendReact/TeamBuildingProyect/controllers/personajes/delete_character.php",
    },
    enlaces: {
      create: "http://localhost/BackendReact/TeamBuildingProyect/controllers/personajes/add_link.php",
      delete: "http://localhost/BackendReact/TeamBuildingProyect/controllers/personajes/edit_link.php",
    },
    sinergias: {
      list: "http://localhost/BackendReact/TeamBuildingProyect/controllers/sinergias/data_sinergies.php",
    }
  };

  useEffect(() => {
    fetch(API.personajes.list)
      .then((res) => res.json())
      .then((data) => {
        setPersonajes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar personajes:", error);
        setLoading(false);
      });
    fetch(API.sinergias.list)
      .then(res => res.json())
      .then(data => setSinergiasDisponibles(data));
  }, [reload]);

  const añadirPersonaje = async () => {
    const { value: nombre } = await Swal.fire({
      title: "Añadir personaje",
      input: "text",
      inputLabel: "Nombre del personaje",
      inputPlaceholder: "Introduce un nombre",
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
    });

    if (!nombre) return;

    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/*";

    const { value: foto } = await Swal.fire({
      title: "Selecciona una imagen",
      html: inputFile,
      preConfirm: () => {
        if (!inputFile.files[0]) {
          Swal.showValidationMessage("Debes seleccionar una imagen");
          return;
        }
        return inputFile.files[0];
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (!foto) return;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("foto", foto);

    await fetch(API.personajes.create, {
      method: "POST",
      body: formData,
    });

    setReload(!reload);
  };

  const añadirSinergia = async (personaje) => {

    const asignadas = new Set(personaje.sinergias.map(s => s.id_sinergia));

    const filteredSinergies = arrayOfSinergies.filter(
      s => !asignadas.has(s.id_sinergia)
    );

    const opciones = filteredSinergies.reduce((acc, s) => {
      acc[s.id_sinergia] = s.nombre;
      return acc;
    }, {});

    const { value: idSinergia } = await Swal.fire({
      title: `Añadir sinergia a ${personaje.nombre}`,
      input: "select",
      inputOptions: opciones,
      inputPlaceholder: "Selecciona una sinergia",
      showCancelButton: true,
      confirmButtonText: "Añadir",
      cancelButtonText: "Cancelar",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Debes seleccionar una sinergia");
        }
        return value;
      }
    });

    if (!idSinergia) return;

    const formData = new FormData();
    formData.append("id_personaje", personaje.id_personaje);
    formData.append("id_sinergia", idSinergia);

    await fetch(API.enlaces.create, {
      method: "POST",
      body: formData
    });

    setReload(!reload);
  };


  const editarNombre = async (personaje) => {
    const { value: nuevoNombre } = await Swal.fire({
      title: "Editar personaje",
      input: "text",
      inputLabel: "Nuevo nombre",
      inputValue: personaje.nombre,
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
    });

    if (!nuevoNombre) return;

    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/*";

    const { value: nuevaFoto } = await Swal.fire({
      title: "Selecciona nueva imagen",
      html: inputFile,
      preConfirm: () => {
        if (!inputFile.files[0]) {
          Swal.showValidationMessage("Debes seleccionar una imagen");
          return;
        }
        return inputFile.files[0];
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (!nuevaFoto) return;

    const formData = new FormData();
    formData.append("id_personaje", personaje.id_personaje);
    formData.append("nombre", nuevoNombre);
    formData.append("foto", nuevaFoto);

    await fetch(API.personajes.edit, {
      method: "POST",
      body: formData,
    });

    setReload(!reload);
  };

  const borrarPersonaje = async (personaje) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar personaje?",
      text: `Se eliminará: ${personaje.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    await fetch(API.personajes.delete, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_personaje: personaje.id_personaje,
      }),
    });

    setReload(!reload);
  };

  const eliminarSinergia = async (personaje, sinergia) => {
    const confirm = await Swal.fire({
      title: "Eliminar sinergia",
      html: `
      <p>¿Quieres eliminar la sinergia <b>${sinergia.nombre_sinergia}</b>?</p>
      <img src="http://localhost/BackendReact/TeamBuildingProyect/Images/${sinergia.foto_sinergia}"
           style="width:80px; margin-top:10px; border-radius:6px;">
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const formData = new FormData();
    formData.append("id_personaje", personaje.id_personaje);
    formData.append("id_sinergia", sinergia.id_sinergia);

    await fetch(API.enlaces.delete, {
      method: "POST",
      body: formData,
    });

    setReload(!reload);
  };


  if (loading) {
    return <p>Cargando personajes...</p>;
  }

  return (
    <div>
      <h1>Listado de personajes</h1>

      <button className="btn-tft" onClick={añadirPersonaje} style={{ marginBottom: "20px", marginTop: "20px" }}>
        Añadir personaje
      </button>

      <div className="tabla-scroll">
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Sinergias</th>
              <th>Eliminar</th>
            </tr>
          </thead>

          <tbody>
            {personajes.map((p) => (
              <tr key={p.id_personaje}>
                <td>{p.id_personaje}</td>

                <td>
                  <img
                    src={"http://localhost/BackendReact/TeamBuildingProyect/Images/" + p.ruta_foto}
                    alt={p.nombre}
                    style={{ width: "80px" }}
                  />
                </td>

                <td
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={() => editarNombre(p)}
                >
                  {p.nombre}
                </td>

                <td>
                  {p.sinergias.length === 0 ? (
                    <button className="btn-tft" onClick={() => añadirSinergia(p)}>
                      Añadir sinergia
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      {p.sinergias.map((s) => (
                        <img
                          key={s.id_sinergia}
                          src={"http://localhost/BackendReact/TeamBuildingProyect/Images/" + s.foto_sinergia}
                          alt={s.nombre_sinergia}
                          style={{ width: "50px", borderRadius: "6px", cursor: "pointer" }}
                          onClick={() => eliminarSinergia(p, s)}
                        />
                      ))}

                      <button onClick={() => añadirSinergia(p)}>
                        +
                      </button>
                    </div>
                  )}
                </td>

                <td>
                  <button className="btn-tft" onClick={() => borrarPersonaje(p)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
