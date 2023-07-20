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
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/values/bd?key=${process.env.GOOGLE_SHEETS_API_KEY}`
        const apiResponse = await axios.get(url)

        const transformedProducts:productProps[] = []

        apiResponse.data.values.map((product) => {
          if(product[0] !== 'id'){
            let transformedProduct = {
                id : Number(product[0]),
                title : product[1],
                sub: product[2],
                description : product[3],
                brand: product[4],
                category : product[5],
                cover : product[6],
                videoURL : product[7],
                mostSellHome : product[8] === 'sim',
                mostSearchShop : product[9] === 'sim',
                variants : product[10].split(',')
            }

            transformedProducts.push(transformedProduct)
          }
        })

        return transformedProducts
    }
}
