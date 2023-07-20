export default interface productProps {
    id : number
    title : string,
    sub : string
    description : string,
    brand: string,
    category : string,
    cover : string,
    videoURL? : string
    mostSellHome : boolean,
    mostSearchShop : boolean
    variants? : string[],
  }