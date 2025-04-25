// Verifica si una materia está habilitada para cursar
export function estaHabilitada(materia, materiasCursadas) {
    return materia.prerrequisitos.every(req => materiasCursadas.includes(req));
  }
  
  // Filtra las materias disponibles para el siguiente trimestre
  export function materiasDisponibles(materias, materiasCursadas) {
    return materias.filter(m => !materiasCursadas.includes(m.codigo) && estaHabilitada(m, materiasCursadas));
  }
  