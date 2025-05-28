import { Area } from '../datos/datos.js';

export class MaquinaCazaMunecos {
  constructor() {
    this.areas = this.crearAreas();
    this.credito = 0;
    this.intentosRestantes = 0;
    this.areaGanadora = null;

    // Posiciones y tamaños
    this.posiciones = [
      { id: 0, x: 130, y: 0 },
      { id: 1, x: 365, y: 0 },
      { id: 2, x: 130, y: 200 },
      { id: 3, x: 365, y: 200 }
    ];
    this.tamañoArea = { ancho: 235, alto: 200 };
    this.margenZonaExacta = 90;  // Margen para la zona donde es valido atrapar
  }

  crearAreas() {
    const areas = [];
    for (let i = 0; i < 4; i++) {
      areas.push(new Area(i));
    }
    areas.push({ id: 4, estado: "SALIDA", muneco: null }); // Area de salida
    return areas;
  }

  insertarMoneda() {
    this.credito++;
    this.intentosRestantes += 3;
  }

  mostrarEstadoAreas() {
    return this.areas.map(area => ({
      id: area.id,
      estado: area.estado,
      muneco: area.muneco || "Ninguno"
    }));
  }

  obtenerIdAreaPorCoordenadas(x, y) {
    for (const pos of this.posiciones) {
      const zona = {
        x1: pos.x,
        y1: pos.y,
        x2: pos.x + this.tamañoArea.ancho,
        y2: pos.y + this.tamañoArea.alto
      };

      if (x >= zona.x1 && x <= zona.x2 && y >= zona.y1 && y <= zona.y2) {
        return pos.id;
      }
    }
    return null;
  }

  estaEnZonaExacta(x, y, idArea) {
    const pos = this.posiciones.find(p => p.id === idArea);
    if (!pos) return false;

    const zonaExacta = {
      x1: pos.x + this.margenZonaExacta,
      y1: pos.y + this.margenZonaExacta,
      x2: pos.x + this.tamañoArea.ancho - this.margenZonaExacta,
      y2: pos.y + this.tamañoArea.alto - this.margenZonaExacta
    };

    return (x >= zonaExacta.x1 && x <= zonaExacta.x2 && y >= zonaExacta.y1 && y <= zonaExacta.y2);
  }

  intentarCapturaPorCoordenadas(x, y) {
  if (this.intentosRestantes <= 0) {
    return { exito: false, mensaje: "⚠️ No tienes intentos disponibles. Inserta una moneda." };
  }

  const idArea = this.obtenerIdAreaPorCoordenadas(x, y);
  if (idArea === null) {
    this.intentosRestantes--;
    return {
      exito: false,
      mensaje: `❌ EL area no es valida. Intentos restantes: ${this.intentosRestantes}`
    };
  }

  const area = this.areas[idArea];
  if (!area || area.estado !== "CON_MUNECO") {
    this.intentosRestantes--;
    return {
      exito: false,
      mensaje: `🚫 El area ${idArea} no tiene muñeco. Intentos restantes: ${this.intentosRestantes}`
    };
  }

  // Validar si la garra esta en la zona exacta
  if (!this.estaEnZonaExacta(x, y, idArea)) {
    this.intentosRestantes--;
    return {
      exito: false,
      mensaje: `❌ Mala suerte, intenta otra vez. Intentos restantes: ${this.intentosRestantes}`
    };
  }

  // Capturar y remover muñeco
  this.intentosRestantes--;
  const munecoGanado = area.removerMuneco();
  this.areas[4].muneco = munecoGanado;
  this.areaGanadora = munecoGanado;

  return {
    exito: true,
    mensaje: `🎉 ¡Capturaste a ${munecoGanado}! Intentos restantes: ${this.intentosRestantes}`,
    muneco: munecoGanado
  };
}


  recargarAreas() {
    this.areas.forEach(area => {
      if (
        typeof area.recargarMuneco === 'function' &&
        (area.estado === "SIN_MUNECO" || area.estado === "REPOSICIONANDO")
      ) {
        area.recargarMuneco();
      }
    });
  }

  estadoGeneral() {
    return {
      credito: this.credito,
      intentosRestantes: this.intentosRestantes,
      salida: this.areas[4].muneco || "Vacío",
      areas: this.mostrarEstadoAreas()
    };
  }

  resetearSalida() {
    this.areas[4].muneco = null;
    this.areaGanadora = null;
  }
}
