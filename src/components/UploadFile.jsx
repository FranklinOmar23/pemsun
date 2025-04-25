import React from 'react';
import toast from 'react-hot-toast';

export default function UploadFile({ onLoadMaterias }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        if (
          !jsonData.program ||
          !jsonData.periods ||
          typeof jsonData.periods !== 'object'
        ) {
          throw new Error("Estructura del archivo inválida");
        }

        onLoadMaterias(jsonData);
        toast.success("Archivo cargado correctamente");
      } catch (err) {
        toast.error("Archivo no válido.");
        console.error("Error leyendo archivo JSON:", err);
      }
    };

    reader.readAsText(file);
  };

  const descargarEjemplo = () => {
    const ejemplo = {
      program: "Ingeniería en Software",
      modality: "trimestral",
      periods: {
        trimestre1: {
          name: "Primer Trimestre (Febrero-Abril)",
          courses: [
            {
              id: "CBC-101",
              name: "Taller de Orientación Universitaria",
              code: "CBC-101",
              prerequisites: []
            },
            {
              id: "CBE-103",
              name: "Español I",
              code: "CBE-103",
              prerequisites: []
            }
          ]
        },
        trimestre2: {
          name: "Segundo Trimestre (Mayo-Julio)",
          courses: [
            {
              id: "CBE-105",
              name: "Español II",
              code: "CBE-105",
              prerequisites: ["CBE-103"]
            }
          ]
        }
      }
    };

    const blob = new Blob([JSON.stringify(ejemplo, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ejemplo-pensum.json";
    link.click();
  };

  return (
    <div className="bg-white shadow-md rounded p-6 border mb-6">
      <h2 className="text-lg font-semibold mb-4">Cargar Pénsum Personalizado</h2>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded cursor-pointer hover:border-blue-500 transition text-center">
        <input
          type="file"
          accept=".json"
          onChange={handleFile}
          className="hidden"
        />
        <p className="font-medium text-gray-600">Subir archivo JSON con el pénsum</p>
        <p className="text-sm text-gray-400">Arrastra o haz clic para seleccionar</p>
      </label>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 mb-2">
          Descarga el ejemplo de cómo debe verse el archivo:
        </p>
        <button
          onClick={descargarEjemplo}
          className="bg-gray-100 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200 text-sm"
        >
          Descargar ejemplo
        </button>
      </div>
    </div>
  );
}
