import Route from '@ioc:Adonis/Core/Route'


Route.get('/products', 'ProductsController.index')
Route.get('/products/:id', 'ProductsController.show')