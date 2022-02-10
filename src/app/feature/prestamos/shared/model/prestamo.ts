export class Prestamo {
    id: number;
    cedula: number;
    equipoComputo: string;
    fechaCreacion: string;
    fechaEntrega: string;
    estado: number;

    constructor(id: number, cedula: number, equipoComputo: string, fechaCreacion: string,
        fechaEntrega: string, estado: number) {
        this.id = id;
        this.cedula = cedula;
        this.equipoComputo = equipoComputo;
        this.fechaCreacion = fechaCreacion;
        this.fechaEntrega = fechaEntrega;
        this.estado = estado;
    }
}
