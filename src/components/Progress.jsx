import React from 'react';

function Progress({ total, completadas, resetProgress }) {
  const porcentaje = ((completadas / total) * 100).toFixed(2);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Tu Progreso</h2>
      <p className="text-4xl font-bold text-blue-600 mb-4">{porcentaje}%</p>
      <p className="text-sm text-gray-600 mb-4">
        {completadas} de {total} materias completadas
      </p>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        onClick={resetProgress}
      >
        Reiniciar Progreso
      </button>
    </div>
  );
}

export default Progress;