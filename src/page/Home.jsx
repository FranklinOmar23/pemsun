import React, { useState, useEffect } from 'react';
import UploadFile from '../components/UploadFile';
import SubjectList from '../components/SubjectList';
import Progress from '../components/Progress';
import toast, { Toaster } from 'react-hot-toast';
import RemainingTimeChart from '../components/RemainingTimeChart';
import { Download, Trash2, MonitorSmartphone } from 'lucide-react';

export default function Home() {
  const [pensumData, setPensumData] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('pensumData'));
      return data && typeof data === 'object' && data.periods ? data : null;
    } catch {
      return null;
    }
  });

  const [completadas, setCompletadas] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('materiasCompletadas'));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [archivoTemporal, setArchivoTemporal] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [instalable, setInstalable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
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
      toast.error(`Faltan prerrequisitos: ${faltantes.join(', ')}`);
      return;
    }

    const actualizado = completadas.includes(id)
      ? completadas.filter((c) => c !== id)
      : [...completadas, id];

    setCompletadas(actualizado);
    localStorage.setItem('materiasCompletadas', JSON.stringify(actualizado));
  };

  const resetProgress = () => {
    setCompletadas([]);
    localStorage.removeItem('materiasCompletadas');
    toast.success("Progreso reiniciado.");
  };

  const generarPensum = () => {
    if (
      !archivoTemporal ||
      !archivoTemporal.program ||
      !archivoTemporal.periods ||
      typeof archivoTemporal.periods !== 'object'
    ) {
      toast.error("Archivo no tiene el formato esperado.");
      return;
    }
    setPensumData(archivoTemporal);
    localStorage.setItem('pensumData', JSON.stringify(archivoTemporal));
    toast.success("Pénsum generado correctamente.");
  };

  const eliminarPensum = () => {
    setPensumData(null);
    setArchivoTemporal(null);
    setCompletadas([]);
    localStorage.removeItem('pensumData');
    localStorage.removeItem('materiasCompletadas');
    toast.success("Pénsum eliminado. Puedes cargar uno nuevo.");
  };

  const totalMaterias =
    pensumData?.periods
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
          Pénsum Interactivo - {pensumData?.program || 'Carrera'}
        </h1>
        {pensumData?.modality && (
          <p className="text-center text-sm text-gray-500 mb-4 capitalize">
            Modalidad: {pensumData.modality}
          </p>
        )}

        {/* Botón de Instalar App */}
        {instalable && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full shadow hover:scale-105 transition"
            >
              <MonitorSmartphone size={18} />
              Descargar App
              <Download size={18} />
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
          <>
            {/* Botón de Eliminar */}
            <div className="text-center mt-6">
              <button
                onClick={eliminarPensum}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition mx-auto"
              >
                <Trash2 size={16} /> Eliminar Pénsum
              </button>
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6">
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
              <div>
                <Progress
                  total={totalMaterias}
                  completadas={completadas.length}
                  resetProgress={resetProgress}
                />
                <RemainingTimeChart pensumData={pensumData} completadas={completadas} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
