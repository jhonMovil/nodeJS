const { response } = require("express");
const { Categoria } = require("../models");

const crearCategoria = async(req,res = response) => {

    try {
        
    

  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({nombre});
   
  if( categoriaDB ){
      return res.status(400).json({
          msg:`La categoria ${ categoriaDB.nombre}, ya existe`
      })
  }

  // Generar la data a guardar
  const data ={
      nombre,
      usuario: req.usuario._id
  }

  const categoria = new Categoria( data );

  //Guardar DB
  await categoria.save();

  res.status(201).json(categoria);

} catch (error) {
    console.log(error);
       throw error;  
}

}

module.exports ={
    crearCategoria
}