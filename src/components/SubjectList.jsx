import React from 'react';

function SubjectList({ trimestre, courses, completadas, toggleMateria }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-700 mb-4">{trimestre}</h2>
      <div className="grid grid-cols-2 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              completadas.includes(course.id)
                ? 'bg-green-100 border-green-400'
                : 'bg-gray-100 border-gray-300'
            }`}
            onClick={() => toggleMateria(course.id, course.prerequisites || [])}
          >
            <h3 className="text-sm font-semibold text-gray-800">{course.name}</h3>
            <p className="text-xs text-gray-600">{course.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectList;
