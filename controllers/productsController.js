var db = require('../database/models/index.js');
const { Sequelize } = require('../database/models/index.js');
const { userInfo } = require('os');



let productsController = {


	raiz: (req, res) => {

		db.sequelize.query('SELECT * FROM productos')

			.then(function (resultados) {

				products = resultados[0];
				res.render('products', { products })

			})

			.catch(error => console.log(error));
	},


	detail: (req, res) => {

		db.Producto.findByPk(req.params.id)

			.then(function (producto) {



				res.render('detail', { producto });

			})
			.catch(error => console.log(error));
	},


	formAlta: (req, res) => {
		let data = {
			Formulario: 'NuevoProducto',
		};
		res.render('formProducto', { data: data });

	},


	crear: (req, res, next) => {      //crear producto nuevo

		db.Producto.create({
			nombre: req.body.nombre,
			color: req.body.color,
			categoría: req.body.categorí1a,
			variedad: req.body.variedad,
			precio: parseFloat(req.body.precio),
			descuento: parseFloat(req.body.descuento),
			descripcionCorta: req.body.descripcionCorta,
			crianza: req.body.crianza,
			descripcionLarga: req.body.descripcionLarga,
			imagen: req.files[0].filename,
			característica: req.body.característica
		})

		let data = {
			Formulario: "NuevoProducto",
			mensaje: 'El producto se agregó exitosamente, puede agregar otro'
		}
		res.render("formProducto", { data: data });



	},


	edit: (req, res) => {

		db.Producto.findByPk(req.params.id)

			.then(function (producto) {
				console.log(producto)

				product = producto;

				console.log(product)
				let data = {
					Formulario: 'ModificarProducto',

				}

				res.render('formProducto', { data, product });

			})

			.catch(error => console.log(error));
	},




	update: (req, res) => {
		db.Producto.update({
			nombre: req.body.nombre,
			color: req.body.color,
			categoría: req.body.categorí1a,
			variedad: req.body.variedad,
			precio: parseFloat(req.body.precio),
			descuento: parseFloat(req.body.descuento),
			descripcionCorta: req.body.descripcionCorta,
			crianza: req.body.crianza,
			descripcionLarga: req.body.descripcionLarga,
			imagen: req.files[0].filename,
			característica: req.body.característica


		}, {

			where:
				{ id: req.params.id }
		})



		res.redirect('/products/edit/' + req.params.id);


	},

	delete: (req, res) => {
		db.Producto.findByPk(req.params.id)
			.then(function (product) {
				let data = {
					Formulario: 'DeleteProducto',

				}
				res.render('formProducto', { data, product });
			})


	},


	destroy: (req, res) => {
		// Do the magic
		db.Producto.destroy({
			where: {
				id: req.params.id
			}
		})

		res.redirect('/products/');


	},

	carrito: (req, res) => {

		db.Carrito.findAll({

			where:{
             id_usuario=req.session.user.id

			},
        include:['Producto','Usuario']

		})
		.then(function(userCarrito){
           
               return res.render('carrito',{userCarrito})
		})

	
	},


	carritoAdd: (req, res) => {


		db.Producto.findByPk(req.params.id)

			.then(function (producto) {

				let Item = {

					id_usuario: req.session.user.id,
					id_producto: producto.id,
					precio_venta: producto.precio,
					cantidad: req.body.cantidad,
				};

				db.Carrito.create(Item)
					.then(function (Item) {

						return res.redirect('/products/carrito')

					})


			}
		}

}

module.exports = productsController;    