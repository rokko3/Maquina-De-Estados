// datos.js

// Lista de muñecos posibles
export const munecosDisponibles = [
    "Stitch",
    "Hámster",
    "Minnie",
    "Freddy"
  ];
  
  // Estados posibles para cada área
  export const estadosArea = [
    "CON_MUNECO",
    "SIN_MUNECO",
    "REPOSICIONANDO",
    "RECOGIENDO_MUNECO"
  ];
  
  // Clase que representa un área de la máquina
  export class Area {
    constructor(id) {
      this.id = id;
      this.estado = this.generarEstadoAleatorio();
      this.muneco = this.estado === "CON_MUNECO" ? this.generarMuneco() : null;
    }
  
    generarEstadoAleatorio() {
      const aleatorio = Math.floor(Math.random() * 3); // SIN_MUNECO no se elige de entrada
      return estadosArea[aleatorio];
    }
  
    generarMuneco() {
      const index = Math.floor(Math.random() * munecosDisponibles.length);
      return munecosDisponibles[index];
    }
  
    recargarMuneco() {
      this.estado = "REPOSICIONANDO";
      setTimeout(() => {
        this.estado = "CON_MUNECO";
        this.muneco = this.generarMuneco();
      }, 1000);
    }
  
    removerMuneco() {
      const munecoEntregado = this.muneco;
      this.muneco = null;
      this.estado = "SIN_MUNECO";
      return munecoEntregado;
    }
  }
  