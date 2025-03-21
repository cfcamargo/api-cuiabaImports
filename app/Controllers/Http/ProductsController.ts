import axios from "axios";
import productProps from "models/product";

export default class ProductsController {
  public async index({ request, response }) {
    const perPage = Number(request.input("perPage", 15));
    const ITEMS_PER_PAGE = perPage;

    try {
      const pageNumber = Number(request.input("page", 1));
      const titleFilter = request.input("title", "");
      const brandFilter = request.input("brand", "");
      const categoryFilter = request.input("category", "");

      let transformedProducts: productProps[] =
        await this.fetchAndTransformProducts();

      if (titleFilter !== "") {
        transformedProducts = transformedProducts.filter((product) =>
          product.title.toLowerCase().includes(titleFilter.toLowerCase())
        );
      }

      if (brandFilter !== "") {
        transformedProducts = transformedProducts.filter((product) =>
          product.brand.toLowerCase().includes(brandFilter.toLowerCase())
        );
      }

      if (categoryFilter !== "") {
        transformedProducts = transformedProducts.filter((product) =>
          product.category.toLowerCase().includes(categoryFilter.toLowerCase())
        );
      }

      const start = (pageNumber - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;

      const data = {
        products: transformedProducts.slice(start, end),
        links: Math.ceil(transformedProducts.length / perPage),
        total: transformedProducts.length,
      };

      response.send(data);
    } catch (error) {
      response.status(500).send("An error occurred while fetching data");
    }
  }

  public async show({ params, response }) {
    try {
      const productId = Number(params.id);

      const transformedProducts: productProps[] =
        await this.fetchAndTransformProducts();

      const product = transformedProducts.find(
        (product) => product.id === productId
      );

      if (!product) {
        return response.status(404).send({ error: "Product not found" });
      } else {
        response.send(product);
      }
    } catch (error) {
      response.status(500).send("An error occurred while fetching data");
    }
  }

  async fetchAndTransformProducts() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/values/PRODUTOS_LOJA?key=${process.env.GOOGLE_SHEETS_API_KEY}`;

    const apiResponse = await axios.get(url);
    const transformedProductsList: productProps[] = [];

    apiResponse.data.values.map((product) => {
      if (
        (product[0] !== "ID" && product[16] === "Sim") ||
        (product[0] !== "id" && product[16] === "sim")
      ) {
        let transformedProduct = {
          id: Number(product[0]),
          qtd: Number(product[1]),
          title: product[2],
          sub: product[3],
          description: product[4],
          brand: product[5],
          category: product[6],
          cover: product[7],
          videoURL: product[8],
          mostSellHome: product[9] === "SIM" ? true : false,
          mostSearchShop: product[10] === "SIM" ? true : false,
          variants: product[11].split(","),
        };

        transformedProductsList.push(transformedProduct);
      }
    });
    return transformedProductsList;
  }
}
