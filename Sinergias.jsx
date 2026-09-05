import { useEffect, useState } from "react";

export default function Sinergias() {
  const [sinergias, setSinergias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const API = {
    sinergias: {
      list: "http://localhost/BackendReact/TeamBuildingProyect/controllers/sinergias/data_sinergies.php",
      create: "http://localhost/BackendReact/TeamBuildingProyect/controllers/sinergias/add_sinergy.php",
      edit: "http://localhost/BackendReact/TeamBuildingProyect/controllers/sinergias/edit_sinergy.php",
      delete: "http://localhost/BackendReact/TeamBuildingProyect/controllers/sinergias/delete_sinergy.php",
    },
    bufos: {
      create: "http://localhost/BackendReact/TeamBuildingProyect/controllers/bufos/add_link.php",
      delete: "http://localhost/BackendReact/TeamBuildingProyect/controllers/bufos/edit_link.php",
    }
  };

  useEffect(() => {
    fetch(API.sinergias.list)
      .then((res) => res.json())
      .then((data) => {
        setSinergias(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar sinergias:", error);
        setLoading(false);
      });
  }, [reload]);

  const añadirSinergia = async () => {
    const { value: nombre } = await Swal.fire({
      title: "Añadir sinergia",
      input: "text",
      inputLabel: "Nombre del sinergia",
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

    await fetch(API.sinergias.create, {
      method: "POST",
      body: formData,
    });

    setReload(!reload);
  };

  const editarNombre = async (sinergia) => {
    const { value: nuevoNombre } = await Swal.fire({
      title: "Editar sinergia",
      input: "text",
      inputLabel: "Nuevo nombre",
      inputValue: sinergia.nombre,
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
    formData.append("id_sinergia", sinergia.id_sinergia);
    formData.append("nombre", nuevoNombre);
    formData.append("foto", nuevaFoto);

    await fetch(API.sinergias.edit, {
      method: "POST",
      body: formData,
    });

    setReload(!reload);
  };

  const borrarPersonaje = async (sinergia) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar sinergia?",
      text: `Se eliminará: ${sinergia.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    await fetch(API.sinergias.delete, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_sinergia: sinergia.id_sinergia,
      }),
    });

    setReload(!reload);
  };

  const añadirBufo = async (sinergia) => {

    const { value: formValues } = await Swal.fire({
      title: `Añadir bufo a ${sinergia.nombre}`,
      html: `
      <input id="swal-numero" class="swal2-input" placeholder="Número del bufo">
      <input id="swal-descripcion" class="swal2-input" placeholder="Descripción del bufo">
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Añadir",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const numero = document.getElementById("swal-numero").value.trim();
        const descripcion = document.getElementById("swal-descripcion").value.trim();

        if (!numero || !descripcion) {
          Swal.showValidationMessage("Debes rellenar ambos campos");
          return false;
        }

        return { numero, descripcion };
      }
    });

    if (!formValues) return;

    const formData = new FormData();
    formData.append("id_sinergia", sinergia.id_sinergia);
    formData.append("numero", formValues.numero);
    formData.append("descripcion", formValues.descripcion);

    await fetch(API.bufos.create, {
      method: "POST",
      body: formData
    });

    setReload(!reload);
  };

  const eliminarBufo = async (sinergia, bufo) => {
    const confirm = await Swal.fire({
      title: "Eliminar bufo",
      html: `
      <p>¿Quieres eliminar el bufo <b>${bufo.descripcion}</b>?</p>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const formData = new FormData();
    formData.append("id_bufo", bufo.id_bufo);
    formData.append("id_sinergia", sinergia.id_sinergia);

    await fetch(API.bufos.delete, {
      method: "POST",
      body: formData,
    });

    setReload(!reload);
  };


  if (loading) {
    return <p>Cargando sinergias...</p>;
  }

  return (
    <div>
      <h1>Listado de sinergias</h1>

      <button className="btn-tft" onClick={añadirSinergia} style={{ marginBottom: "20px", marginTop: "20px" }}>
        Añadir sinergia
      </button>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Buffos</th>
            <th>Eliminar</th>
          </tr>
        </thead>

        <tbody>
          {sinergias.map((p) => (
            <tr key={p.id_sinergia}>
              <td>{p.id_sinergia}</td>
              <td><img src={"http://localhost/BackendReact/TeamBuildingProyect/Images/" + p.ruta_foto} alt={p.nombre} style={{ width: "80px" }} /></td>
              <td
                style={{ cursor: "pointer", color: "white" }}
                onClick={() => editarNombre(p)}
              >{p.nombre}</td>
              <td>
                {p.bufos.length === 0 ? (
                  <button className="btn-tft" onClick={() => añadirBufo(p)}>
                    Añadir bufo
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {p.bufos.map((b) => (
                      <div
                        key={b.id_bufo}
                        onClick={() => eliminarBufo(p, b)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          background: "rgba(123, 92, 255, 0.12)",
                          border: "1px solid rgba(123, 92, 255, 0.25)",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "0.2s",
                        }}
                      >
                        <span style={{ fontWeight: "600", color: "var(--text-h)" }}>
                          {b.numero}
                        </span>

                        <span style={{ color: "var(--text)" }}>
                          {b.descripcion}
                        </span>
                      </div>
                    ))}

                    <button className="btn-tft" onClick={() => añadirBufo(p)}>
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
  );
}
