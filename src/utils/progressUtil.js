import toast from "react-hot-toast";

/**
 * Exporta el progreso actual como un archivo JSON.
 * @param {Object} pensumData - Datos del pénsum actual.
 * @param {Array} completadas - Lista de materias completadas.
 */
export const exportarProgreso = (pensumData, completadas) => {
  if (!pensumData) {
    toast.error("No hay un pénsum cargado para exportar.");
    return;
  }

  const progreso = {
    pensumData,
    completadas,
  };

  const blob = new Blob([JSON.stringify(progreso, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "progreso-pensum.json";
  link.click();
  toast.success("Progreso exportado correctamente.");
};

/**
 * Importa el progreso desde un archivo JSON.
 * @param {File} file - Archivo JSON cargado por el usuario.
 * @param {Function} setPensumData - Función para actualizar el estado del pénsum.
 * @param {Function} setCompletadas - Función para actualizar el estado de materias completadas.
 */
export const importarProgreso = (file, setPensumData, setCompletadas) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      // Validar el formato del archivo
      if (!data.pensumData || !data.completadas) {
        throw new Error("Formato de archivo inválido.");
      }

      // Actualizar el estado de la aplicación
      setPensumData(data.pensumData);
      setCompletadas(data.completadas);

      // Guardar en localStorage
      localStorage.setItem("pensumData", JSON.stringify(data.pensumData));
      localStorage.setItem("materiasCompletadas", JSON.stringify(data.completadas));

      toast.success("Progreso importado correctamente.");
    } catch (err) {
      toast.error("Error al importar el progreso.");
      console.error("Error leyendo archivo JSON:", err);
    }
  };

  reader.readAsText(file);
};