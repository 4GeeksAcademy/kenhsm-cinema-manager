if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const app = document.querySelector<HTMLParagraphElement>("#app");
    if (app) {
      app.textContent = "If you can see this, Tailwind is working.";
    }
  });
}

console.log("Hello from src/main.ts");

function crearSalaCine(): number[][] {
  const filas = 8;
  const columnas = 10;

  // 0 = desocupado, 1 = ocupado
  return Array.from({ length: filas }, () => Array(columnas).fill(0));
}

function mostrarEstadoSala(sala: number[][]): void {
  console.log("Estado actual de la sala:");

  const anchoCelda = 3;
  const anchoEtiquetaFila = 9;

  const encabezadoColumnas = sala[0]
    .map((_, indiceColumna) => indiceColumna.toString().padStart(anchoCelda, " "))
    .join("");

  console.log(`${"".padEnd(anchoEtiquetaFila, " ")}${encabezadoColumnas}`);

  sala.forEach((fila, indiceFila) => {
    const etiquetaFila = `Fila ${indiceFila}`.padEnd(anchoEtiquetaFila, " ");
    const estadoFila = fila
      .map((asiento) => (asiento === 1 ? "X" : "L").padStart(anchoCelda, " "))
      .join("");

    console.log(`${etiquetaFila}${estadoFila}`);
  });
}

function reservarAsiento(sala: number[][], fila: number, columna: number): string {
  const filaValida = fila >= 0 && fila < sala.length;
  const columnaValida = filaValida && columna >= 0 && columna < sala[fila].length;

  if (!filaValida || !columnaValida) {
    return `Fallo al reservar: posicion invalida (fila ${fila}, columna ${columna}).`;
  }

  if (sala[fila][columna] === 1) {
    return `Fallo al reservar: el asiento fila ${fila}, columna ${columna} ya esta ocupado.`;
  }

  sala[fila][columna] = 1;
  return `Reserva exitosa: asiento fila ${fila}, columna ${columna} apartado.`;
}

function disposnibilidadAsientos(
  sala: number[][],
): { ocupados: number; disponibles: number } {
  const totalAsientos = sala.reduce((total, fila) => total + fila.length, 0);
  const ocupados = sala.reduce(
    (total, fila) => total + fila.filter((asiento) => asiento === 1).length,
    0,
  );

  return {
    ocupados,
    disponibles: totalAsientos - ocupados,
  };
}

function buscarAsientosContiguosDisponibles(
  sala: number[][],
):
  | { fila: number; asientos: [number, number] }
  | { mensaje: string } {
  for (let fila = 0; fila < sala.length; fila++) {
    for (let columna = 0; columna < sala[fila].length - 1; columna++) {
      const asientoActualLibre = sala[fila][columna] === 0;
      const asientoSiguienteLibre = sala[fila][columna + 1] === 0;

      if (asientoActualLibre && asientoSiguienteLibre) {
        return { fila, asientos: [columna, columna + 1] };
      }
    }
  }

  return {
    mensaje:
      "No se encontraron dos asientos contiguos disponibles en la misma fila.",
  };
}

function reservarPrimerParContiguoDisponible(sala: number[][]): string {
  const resultadoBusqueda = buscarAsientosContiguosDisponibles(sala);

  if ("mensaje" in resultadoBusqueda) {
    return resultadoBusqueda.mensaje;
  }

  const [columnaA, columnaB] = resultadoBusqueda.asientos;
  const mensajeReservaA = reservarAsiento(sala, resultadoBusqueda.fila, columnaA);
  const mensajeReservaB = reservarAsiento(sala, resultadoBusqueda.fila, columnaB);

  return [
    `Par contiguo encontrado en fila ${resultadoBusqueda.fila}, columnas ${columnaA} y ${columnaB}.`,
    mensajeReservaA,
    mensajeReservaB,
  ].join(" ");
}

// Alias para evitar fallos por el nombre en singular usado en algunos llamados.
function buscarAsientosContiguoDisponibles(sala: number[][]): string {
  return reservarPrimerParContiguoDisponible(sala);
}

const salaCine = crearSalaCine();
mostrarEstadoSala(salaCine);
console.log(reservarAsiento(salaCine, 2, 5));
console.log(disposnibilidadAsientos(salaCine));
console.log(reservarAsiento(salaCine, 0, 7));
mostrarEstadoSala(salaCine);
console.log(buscarAsientosContiguoDisponibles(salaCine));
mostrarEstadoSala(salaCine);



export {};
