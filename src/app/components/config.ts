export const ITEMSPORPAGE: number = 10;
export function datos(element: any) {
    return {
        id: element.payload.doc.id,
        ...element.payload.doc.data()
    }
}




