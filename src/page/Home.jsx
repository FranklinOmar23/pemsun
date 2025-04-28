import React, { useState, useEffect } from "react";
import UploadFile from "../components/UploadFile";
import SubjectList from "../components/SubjectList";
import Progress from "../components/Progress";
import toast, { Toaster } from "react-hot-toast";
import RemainingTimeChart from "../components/RemainingTimeChart";
import {
  Trash2,
  Save,
  UploadCloud,
  MonitorSmartphone,
  Download,
} from "lucide-react";
import { exportarProgreso, importarProgreso } from "../utils/progressUtil";

export default function Home() {
  const [pensumData, setPensumData] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem("pensumData"));
      return data && typeof data === "object" && data.periods ? data : null;
    } catch {
      return null;
    }
  });

  const [completadas, setCompletadas] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("materiasCompletadas"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const handleImportarProgreso = (e) => {
    const file = e.target.files[0];
    importarProgreso(file, setPensumData, setCompletadas);
  };

  const [archivoTemporal, setArchivoTemporal] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [instalable, setInstalable] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstalable(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setInstalable(false);
      });
    }
  };

  const toggleMateria = (id, prerequisites) => {
    const faltantes = prerequisites.filter((p) => !completadas.includes(p));
    if (faltantes.length > 0) {
      toast.error(`Faltan prerrequisitos: ${faltantes.join(", ")}`);
      return;
    }

    const actualizado = completadas.includes(id)
      ? completadas.filter((c) => c !== id)
      : [...completadas, id];

    setCompletadas(actualizado);
    localStorage.setItem("materiasCompletadas", JSON.stringify(actualizado));
  };

  const resetProgress = () => {
    setCompletadas([]);
    localStorage.removeItem("materiasCompletadas");
    toast.success("Progreso reiniciado.");
  };

  const generarPensum = () => {
    if (
      !archivoTemporal ||
      !archivoTemporal.program ||
      !archivoTemporal.periods ||
      typeof archivoTemporal.periods !== "object"
    ) {
      toast.error("Archivo no tiene el formato esperado.");
      return;
    }
    setPensumData(archivoTemporal);
    localStorage.setItem("pensumData", JSON.stringify(archivoTemporal));
    toast.success("Pénsum generado correctamente.");
  };

  const eliminarPensum = () => {
    setPensumData(null);
    setArchivoTemporal(null);
    setCompletadas([]);
    localStorage.removeItem("pensumData");
    localStorage.removeItem("materiasCompletadas");
    toast.success("Pénsum eliminado. Puedes cargar uno nuevo.");
  };

  const totalMaterias = pensumData?.periods
    ? Object.values(pensumData.periods).reduce(
        (acc, t) => acc + (Array.isArray(t.courses) ? t.courses.length : 0),
        0
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Pénsum Interactivo - {pensumData?.program || "Carrera"}
        </h1>
        {pensumData?.modality && (
          <p className="text-center text-sm text-gray-500 mb-4 capitalize">
            Modalidad: {pensumData.modality}
          </p>
        )}

        {/* Botones de acciones */}
        {pensumData && (
          <div className="flex w-full md:w-[20%] bg-gray-950 dark:bg-gray-950 border rounded-lg overflow-hidden justify-center mt-6 divide-x divide-neutral-900 dark:divide-neutral-950">
          {/* Botón de Eliminar Pénsum */}
          <button
            onClick={eliminarPensum}
            title="Eliminar el pénsum actual"
            className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
      
          {/* Botón de Exportar Progreso */}
          <button
            onClick={() => exportarProgreso(pensumData, completadas)}
            title="Exportar tu progreso en un archivo JSON"
            className="px-4 py-2 font-medium bg-gray-950 text-gray-950 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
          >
            <Save className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
      
          {/* Botón de Importar Progreso */}
          <button
            title="Importar tu progreso desde un archivo JSON"
            className="flex items-center justify-center gap-2 px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 relative overflow-hidden"
          >
            <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportarProgreso}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </button>
        </div>
        )}

        {/* Subida de Pénsum */}
        {!pensumData && (
          <>
            <UploadFile onLoadMaterias={setArchivoTemporal} />
            {archivoTemporal && (
              <div className="text-center mt-4">
                <button
                  onClick={generarPensum}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Generar Pénsum
                </button>
              </div>
            )}
          </>
        )}

        {/* Contenido del Pénsum */}
        {pensumData?.periods && (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6">
            <div>
              <Progress
                total={totalMaterias}
                completadas={completadas.length}
                resetProgress={resetProgress}
              />
              <RemainingTimeChart
                pensumData={pensumData}
                completadas={completadas}
              />
            </div>
            <div className="md:col-span-2">
              {Object.entries(pensumData.periods).map(([key, periodo]) => (
                <SubjectList
                  key={key}
                  trimestre={periodo.name}
                  courses={periodo.courses}
                  completadas={completadas}
                  toggleMateria={toggleMateria}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
