import React from 'react';

export default function SubjectItem({ subject, completed, toggleCompleted }) {
  return (
    <div
      onClick={() => toggleCompleted(subject.codigo)}
      className={`cursor-pointer p-2 rounded mb-1 border ${
        completed ? 'line-through bg-gray-200 text-gray-500' : 'hover:bg-gray-100'
      }`}
    >
      <strong>{subject.codigo}</strong> - {subject.nombre}
      {subject.prerrequisitos.length > 0 && (
        <div className="text-sm text-gray-600 mt-1">
          Prerrequisitos: {subject.prerrequisitos.join(', ')}
        </div>
      )}
    </div>
  );
}
