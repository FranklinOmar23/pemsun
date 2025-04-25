import { useEffect, useState } from 'react';
import materias from '../data/materias.json';

export function useMaterias() {
  const [completed, setCompleted] = useState(() => {
    return JSON.parse(localStorage.getItem('materiasCompletadas') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('materiasCompletadas', JSON.stringify(completed));
  }, [completed]);

  const toggleMateria = (codigo) => {
    setCompleted((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  return {
    materias,
    completed,
    toggleMateria,
  };
}
