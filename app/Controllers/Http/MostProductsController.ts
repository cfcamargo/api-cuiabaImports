import axios from 'axios'
import productProps from 'models/product'

export default class ProductsController {
    public async index({request, response}) {
        try {
            const mostType = request.input('most')

            const transformedProducts:productProps[] = await this.fetchAndTransformProducts()

            const mostProducts:productProps[] = []

            if(mostType === 'sell'){
                transformedProducts.map((product:productProps) => {
                    if(product.mostSellHome && mostProducts.length < 10){
                      mostProducts.push(product)
                    }
                })
            } else if(mostType === 'search'){
                transformedProducts.map((product:productProps) => {
                  if(product.mostSearchShop && mostProducts.length < 10){
                    mostProducts.push(product)
                  }
              })
            }

            response.send(mostProducts)
          } catch (error) {
            response.status(500).send('An error occurred while fetching data')
          }
    }

    async fetchAndTransformProducts() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/values/PRODUTOS_LOJA?key=${process.env.GOOGLE_SHEETS_API_KEY}`
        const apiResponse = await axios.get(url)


        const transformedProducts:productProps[] = []

        apiResponse.data.values.map((product) => {
          if(product[0] !== 'id' && product[16] === 'Sim' || product[0] !== 'id' && product[16] === 'sim'){
            console.log(product[9])
            console.log(product[10])
            let transformedProduct = {
                id : Number(product[0]),
                qtd : Number(product[1]),
                title : product[2],
                sub: product[3],
                description : product[4],
                brand: product[5],
                category : product[6],
                cover : product[7],
                videoURL : product[8],
                mostSellHome : product[9].toUpperCase === 'SIM' ? true : false,
                mostSearchShop : product[10].toUpperCase === 'NAO' ? true : false,
                variants : product[11].split(','),
            }

            transformedProducts.push(transformedProduct)
          }
        })

        return transformedProducts
    }
}
