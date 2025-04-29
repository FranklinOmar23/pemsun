import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function RemainingTimeChart({ pensumData, completadas }) {
  if (!pensumData?.periods) return null;

  const modalidad = pensumData.modality?.toLowerCase();
  const periodosPorAnio =
    modalidad === 'cuatrimestral' ? 3 :
    modalidad === 'semestral' ? 2 :
    4;

  const periodos = Object.values(pensumData.periods);
  const totalPeriodos = periodos.length;

  const periodosAgrupados = [];
  for (let i = 0; i < totalPeriodos; i += periodosPorAnio) {
    periodosAgrupados.push(periodos.slice(i, i + periodosPorAnio));
  }

  const progresoPorAnio = periodosAgrupados.map((anio, index) => {
    const bloques = anio.map((periodo) => {
      const total = periodo.courses.length;
      const completas = periodo.courses.filter((m) => completadas.includes(m.id)).length;
      const progreso = total === 0 ? 0 : completas / total;

      return {
        nombre: periodo.name,
        total,
        completas,
        progreso
      };
    });

    const materiasTotales = bloques.reduce((acc, b) => acc + b.total, 0);
    const materiasCompletas = bloques.reduce((acc, b) => acc + b.completas, 0);

    return {
      anio: index + 1,
      bloques,
      total: materiasTotales,
      completadas: materiasCompletas
    };
  });

  const totalMaterias = progresoPorAnio.reduce((a, b) => a + b.total, 0);
  const totalCompletadas = progresoPorAnio.reduce((a, b) => a + b.completadas, 0);

  const añosRestantes = (totalMaterias - totalCompletadas) / (totalMaterias / progresoPorAnio.length);
  const años = Math.floor(añosRestantes);
  const restante = Math.round((añosRestantes - años) * periodosPorAnio);

  const getColor = (progreso) => {
    if (progreso === 1) return 'bg-green-500';
    if (progreso >= 0.5) return 'bg-yellow-400';
    if (progreso > 0) return 'bg-orange-300';
    return 'bg-gray-200';
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-blue-500 w-5 h-5" />
        <h3 className="text-lg font-bold text-gray-700 ">Progreso por Años Académicos</h3>
      </div>

      {progresoPorAnio.map((item) => (
        <div key={item.anio} className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Año {item.anio}</span>
            <span>{item.completadas}/{item.total} Materias</span>
          </div>
          <div className="flex gap-2">
            {item.bloques.map((bloque, i) => (
              <div
                key={i}
                className={`h-3 rounded transition-all duration-500 ${getColor(bloque.progreso)}`}
                style={{ flex: 1 }}
                title={`${bloque.nombre} - ${bloque.completas}/${bloque.total}`}
              ></div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 text-sm text-gray-800">
        <p>
          <span className="font-medium">Tiempo estimado restante:</span>{' '}
          {años > 0 ? `${años} año${años > 1 ? 's' : ''}` : ''}
          {años > 0 && restante > 0 ? ' y ' : ''}
          {restante > 0 ? `${restante} ${modalidad}${restante > 1 ? 's' : ''}` : ''}
        </p>
        <p className="text-gray-500">
          Programa total: {progresoPorAnio.length} años ({totalPeriodos} {modalidad}s)
        </p>
      </div>
    </div>
  );
}
