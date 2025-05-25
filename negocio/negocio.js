import { Area } from '../datos/datos.js';

export class MaquinaCazaMunecos {
  constructor() {
    this.areas = this.crearAreas();
    this.credito = 0;
    this.intentosRestantes = 0;
    this.areaGanadora = null;
  }

  crearAreas() {
    const areas = [];
    for (let i = 0; i < 4; i++) {
      areas.push(new Area(i));
    }
    // Área de salida (solo entrega)
    areas.push({ id: 4, estado: "SALIDA", muneco: null });
    return areas;
  }

  insertarMoneda() {
    this.credito++;
    this.intentosRestantes += 3;
    console.log(`Moneda insertada. Intentos disponibles: ${this.intentosRestantes}`);
  }

  mostrarEstadoAreas() {
    return this.areas.map(area => ({
      id: area.id,
      estado: area.estado,
      muneco: area.muneco || "Ninguno"
    }));
  }

  intentarCaptura(idAreaSeleccionada) {
    if (this.intentosRestantes <= 0) {
      return { exito: false, mensaje: "⚠️ No tienes intentos disponibles. Inserta una moneda." };
    }

    const area = this.areas[idAreaSeleccionada];
    if (!area || typeof area.removerMuneco !== 'function') {
      return { exito: false, mensaje: "❌ Área inválida." };
    }

    if (area.estado !== "CON_MUNECO") {
      this.intentosRestantes--;
      return {
        exito: false,
        mensaje: `🚫 El área ${idAreaSeleccionada} no tiene un muñeco disponible. Intentos restantes: ${this.intentosRestantes}`
      };
    }

    const capturado = Math.random() < 0.5; // 50% éxito por defecto
    this.intentosRestantes--;

    if (capturado) {
      const munecoGanado = area.removerMuneco();
      setTimeout(() => {
        this.areas[4].muneco = munecoGanado; // Área de salida
        this.areaGanadora = munecoGanado;
      }, 500); // simula recolección
      return {
        exito: true,
        mensaje: `🎉 ¡Capturaste a ${munecoGanado}! Intentos restantes: ${this.intentosRestantes}`
      };
    } else {
      return {
        exito: false,
        mensaje: `❌ Fallaste al intentar capturar el muñeco. Intentos restantes: ${this.intentosRestantes}`
      };
    }
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
