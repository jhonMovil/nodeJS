const { response, request } = require("express");
const { Producto } = require("../models");


//obtener productos - paginado - total - populate
const obtenerProductos = async(req = request, res = response) =>{
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
             .populate('usuario','nombre')
             .populate('categoria','nombre')
             .skip( Number( desde ) )
             .limit(Number( limite ))
    ]);

    res.json({
        total,
        productos
    });
}


// obtener producto - populate {}
const obtenerProducto = async(req , res = response) =>{

    const { id } = req.params;
    const producto = await Producto.findById(id)
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.json(producto);

}


// crear Producto
const crearProducto = async(req,res = response) => {

    try {
        
        const { estado, usuario, ...body } = req.body; // ignorar estado y usuario

        const productoDB = await Producto.findOne({ nombre: body.nombre });
    
        if ( productoDB ) {
            return res.status(400).json({
                msg: `El producto ${ productoDB.nombre }, ya existe`
            });
        }
    
        // Generar la data a guardar
        const data = {
            ...body, // descripcion, precio y demas
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }
    
        const producto = new Producto( data );
    
        // Guardar DB
        await producto.save();
    
        res.status(201).json(producto);

} catch (error) {
       console.log(error);
       throw new Error(' No se pudo crear correctamente el producto');  
}

}

// actualizar Producto

const actualizarProducto = async(req, res =response) =>{

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json( producto );
}

// borrarProducto - estado:false
const borrarProducto = async (req, res = response) =>{
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id,{ estado:false},{ new:true});


    res.status(200).json(productoBorrado);
}


module.exports ={
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}