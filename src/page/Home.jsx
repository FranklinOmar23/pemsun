import React, { useState } from 'react';
import UploadFile from '../components/UploadFile';
import SubjectList from '../components/SubjectList';
import Progress from '../components/Progress';
import toast, { Toaster } from 'react-hot-toast';
import RemainingTimeChart from '../components/RemainingTimeChart';

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

  const totalMaterias =
    pensumData?.periods
      ? Object.values(pensumData.periods).reduce(
          (acc, t) => acc + (Array.isArray(t.courses) ? t.courses.length : 0),
          0
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-2">
          Pénsum Interactivo - {pensumData?.program || 'Carrera'}
        </h1>
        {pensumData?.modality && (
          <p className="text-center text-sm text-gray-500 mb-4 capitalize">
            Modalidad: {pensumData.modality}
          </p>
        )}

        {/* Upload y botón de generar */}
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

        {/* Lista de materias y progreso */}
        {pensumData?.periods && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2 flex flex-col gap-4">
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
            <div className="md:col-span-1 sticky top-4 self-start flex flex-col gap-4">
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
          </div>
        )}
      </div>
    </div>
  );
}
