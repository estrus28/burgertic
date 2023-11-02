const express = require('express');
const app = express();
const menu = require('./menu.json');
const PORT = 3000; 
app.use(express.json()); 

app.listen(PORT, () => {
  console.log('El servidor se esta ejecutando de forma correcta');
});

app.get('/menu', (req, res) => {
    res.json(menu);
});

  app.get('/menu/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const comida = menu.find(item => item.id === id);
    if (!comida) {
      res.status(404).json({ msg: 'No se encontró esa comida' });
    } else {
      res.json(comida);
    }
  });
  
  app.get('/principales', (req, res) => {
    const principales = menu.filter(item => item.tipo === 'principal');
    res.json(principales);
  });
  
    app.get('/postres', (req, res) => {
      const postres = menu.filter(item => item.tipo === 'postre');
      res.json(postres);
    });

  app.get('/combos', (req, res) => {
    const combos = menu.filter(item => item.tipo === 'combo');
    res.json(combos);
  });

  app.post('/pedido', (req, res) => {
    const articulos = req.body;
    const precioTotal = articulos.reduce((total, articulo) => {
      const comida = menu.find(item => item.id === articulo.id);
      if (comida) 
      {
        total += comida.precio * articulo.cantidad;
      }
      return total;
    }, 0);
  
    res.json({ msg: 'Tu pedido ha sido recibido', precio: precioTotal });
  });
  app.get('/pedidos/:id', (req, res) => {
    const { id } = req.body;

    menu.query("SELECT * FROM pedidos JOIN usuarios ON pedidos.id_usuario = usuario.id WHERE pedidos.id_usuario = ?;",
    [parseInt(id)], 
    (err, rows) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(rows);
    });
});
