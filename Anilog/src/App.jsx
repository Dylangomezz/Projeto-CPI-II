import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 mb-4">
          AnimePulse ⚡
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Setup concluído com sucesso! React, Tailwind CSS e ecossistema de bibliotecas prontos para o projeto do Dylan.
        </p>
        <button className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-6 py-2 rounded-lg transition-all shadow-lg shadow-rose-600/20">
          Explorar Catálogo
        </button>
      </div>
    </div>
  );
}

export default App;