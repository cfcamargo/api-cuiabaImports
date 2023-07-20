import axios from 'axios'
import productProps from 'models/product'

export default class ProductsController {

    public async index({request, response}) {
        const ITEMS_PER_PAGE = 16
        try {
            const pageNumber = Number(request.input('page', 1))

            const transformedProducts:productProps[] = await this.fetchAndTransformProducts()

            const start = (pageNumber - 1) * ITEMS_PER_PAGE
            const end = start + ITEMS_PER_PAGE

            response.send(transformedProducts.slice(start, end))
          } catch (error) {
            response.status(500).send('An error occurred while fetching data')
          }
    }



    public async show({params, response}) {
        try {
            const productId = Number(params.id)

            const transformedProducts:productProps[] = await this.fetchAndTransformProducts()

            const product = transformedProducts.find(product => product.id === productId)

            if(!product){
                return response.status(404).send({ error: 'Product not found' })
            } else {
                response.send(product)
            }

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
