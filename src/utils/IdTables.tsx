export abstract class IdTable{
    static returnIdCell(id: string){
        const regex = /^(\d+).(\d+)$/
        const result = id.match(regex)!
        const id1 = result[1]
        const id2 = result[2]
        return id2
    }
    static returnIdTable(id: string){
        const result = id.split(".")!
        const idTable = result[0]
        const id2 = result[1]
        return idTable
    }

    static returnAllId(id: string): string[]{
        const result = id.split(".")!
        
        const idTable = result[0]
        const idItem = result[1]
        return [idTable, idItem]
    }
    static createId(){

    }
}