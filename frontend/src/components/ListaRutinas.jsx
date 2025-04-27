const rutinasFake = [
    { id: 1, nombre: "Pecho Full", autor: "Andrei" },
    { id: 2, nombre: "Pierna Extrema", autor: "Carlos" },
  ];
  
  export default function ListaRutinas() {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Rutinas disponibles</h2>
        <ul>
          {rutinasFake.map(rutina => (
            <li key={rutina.id}>
              {rutina.nombre} - <em>{rutina.autor}</em>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  