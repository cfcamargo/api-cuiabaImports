import Route from '@ioc:Adonis/Core/Route'

Route.get('/', ({response}) => {
    return response.status(404).send({error: 'Not Found'});
})

Route.get('/products', 'ProductsController.index')
Route.get('/products/:id', 'ProductsController.show')

Route.get('/mostproducts', 'MostProductsController.index')
