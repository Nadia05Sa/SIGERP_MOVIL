import entradasR from '../../assets/entradasR.png';
import entradas from '../../assets/entradas.png';
import platoFuerteR from '../../assets/plato_fuerteR.png';
import platoFuerte from '../../assets/plato_fuerte.png';
import guarnicionesR from '../../assets/guarnicionesR.png';
import guarniciones from '../../assets/guarniciones.png';
import postresR from '../../assets/postresR.png';
import postres from '../../assets/postres.png';
import bebidasR from '../../assets/bebidasR.png';
import bebidas from '../../assets/bebidas.png';
import coctelesR from '../../assets/coctelesR.png';
import cocteles from '../../assets/cocteles.png';

export const categories = [
  { 
    id: '1', 
    name: 'Entradas', 
    image: entradasR, 
    dishes: [
      { id: '1', name: 'Entrada 1', description: 'Descripción breve del platillo', price: '100.00', image: entradas },
      { id: '2', name: 'Entrada 2', description: 'Descripción breve del platillo', price: '110.00', image: entradas },
      { id: '3', name: 'Entrada 3', description: 'Descripción breve del platillo', price: '120.00', image: entradas },
      { id: '4', name: 'Entrada 4', description: 'Descripción breve del platillo', price: '130.00', image: entradas },
      { id: '5', name: 'Entrada 5', description: 'Descripción breve del platillo', price: '140.00', image: entradas },
      { id: '6', name: 'Entrada 6', description: 'Descripción breve del platillo', price: '150.00', image: entradas },
      { id: '7', name: 'Entrada 7', description: 'Descripción breve del platillo', price: '160.00', image: entradas },
      { id: '8', name: 'Entrada 8', description: 'Descripción breve del platillo', price: '170.00', image: entradas },
      { id: '9', name: 'Entrada 9', description: 'Descripción breve del platillo', price: '180.00', image: entradas },
      { id: '10', name: 'Entrada 10', description: 'Descripción breve del platillo', price: '190.00', image: entradas },
      { id: '11', name: 'Entrada 11', description: 'Descripción breve del platillo', price: '200.00', image: entradas },
      { id: '12', name: 'Entrada 12', description: 'Descripción breve del platillo', price: '210.00', image: entradas },
    ] 
  },
  { 
    id: '2', 
    name: 'Plato Fuerte', 
    image: platoFuerteR, 
    dishes: [
      { id: '1', name: 'Plato Fuerte 1', description: 'Descripción breve del platillo', price: '150.00', image: platoFuerte },
      { id: '2', name: 'Plato Fuerte 2', description: 'Descripción breve del platillo', price: '160.00', image: platoFuerte },
      { id: '3', name: 'Plato Fuerte 3', description: 'Descripción breve del platillo', price: '170.00', image: platoFuerte },
      { id: '4', name: 'Plato Fuerte 4', description: 'Descripción breve del platillo', price: '180.00', image: platoFuerte },
      { id: '5', name: 'Plato Fuerte 5', description: 'Descripción breve del platillo', price: '190.00', image: platoFuerte },
      { id: '6', name: 'Plato Fuerte 6', description: 'Descripción breve del platillo', price: '200.00', image: platoFuerte },
      { id: '7', name: 'Plato Fuerte 7', description: 'Descripción breve del platillo', price: '210.00', image: platoFuerte },
      { id: '8', name: 'Plato Fuerte 8', description: 'Descripción breve del platillo', price: '220.00', image: platoFuerte },
      { id: '9', name: 'Plato Fuerte 9', description: 'Descripción breve del platillo', price: '230.00', image: platoFuerte },
      { id: '10', name: 'Plato Fuerte 10', description: 'Descripción breve del platillo', price: '240.00', image: platoFuerte },
      { id: '11', name: 'Plato Fuerte 11', description: 'Descripción breve del platillo', price: '250.00', image: platoFuerte },
      { id: '12', name: 'Plato Fuerte 12', description: 'Descripción breve del platillo', price: '260.00', image: platoFuerte },
    ] 
  },
  { 
    id: '3', 
    name: 'Guarniciones', 
    image: guarnicionesR, 
    dishes: [
      { id: '1', name: 'Guarnición 1', description: 'Descripción breve del platillo', price: '90.00', image: guarniciones },
      { id: '2', name: 'Guarnición 2', description: 'Descripción breve del platillo', price: '95.00', image: guarniciones },
      { id: '3', name: 'Guarnición 3', description: 'Descripción breve del platillo', price: '100.00', image: guarniciones },
      { id: '4', name: 'Guarnición 4', description: 'Descripción breve del platillo', price: '105.00', image: guarniciones },
      { id: '5', name: 'Guarnición 5', description: 'Descripción breve del platillo', price: '110.00', image: guarniciones },
      { id: '6', name: 'Guarnición 6', description: 'Descripción breve del platillo', price: '115.00', image: guarniciones },
      { id: '7', name: 'Guarnición 7', description: 'Descripción breve del platillo', price: '120.00', image: guarniciones },
      { id: '8', name: 'Guarnición 8', description: 'Descripción breve del platillo', price: '125.00', image: guarniciones },
      { id: '9', name: 'Guarnición 9', description: 'Descripción breve del platillo', price: '130.00', image: guarniciones },
      { id: '10', name: 'Guarnición 10', description: 'Descripción breve del platillo', price: '135.00', image: guarniciones },
      { id: '11', name: 'Guarnición 11', description: 'Descripción breve del platillo', price: '140.00', image: guarniciones },
      { id: '12', name: 'Guarnición 12', description: 'Descripción breve del platillo', price: '145.00', image: guarniciones },
    ] 
  },
  { 
    id: '4', 
    name: 'Postres', 
    image: postresR, 
    dishes: [
      { id: '1', name: 'Postre 1', description: 'Descripción breve del platillo', price: '50.00', image: postres },
      { id: '2', name: 'Postre 2', description: 'Descripción breve del platillo', price: '60.00', image: postres },
      { id: '3', name: 'Postre 3', description: 'Descripción breve del platillo', price: '70.00', image: postres },
      { id: '4', name: 'Postre 4', description: 'Descripción breve del platillo', price: '80.00', image: postres },
      { id: '5', name: 'Postre 5', description: 'Descripción breve del platillo', price: '90.00', image: postres },
      { id: '6', name: 'Postre 6', description: 'Descripción breve del platillo', price: '100.00', image: postres },
      { id: '7', name: 'Postre 7', description: 'Descripción breve del platillo', price: '110.00', image: postres },
      { id: '8', name: 'Postre 8', description: 'Descripción breve del platillo', price: '120.00', image: postres },
      { id: '9', name: 'Postre 9', description: 'Descripción breve del platillo', price: '130.00', image: postres },
      { id: '10', name: 'Postre 10', description: 'Descripción breve del platillo', price: '140.00', image: postres },
      { id: '11', name: 'Postre 11', description: 'Descripción breve del platillo', price: '150.00', image: postres },
      { id: '12', name: 'Postre 12', description: 'Descripción breve del platillo', price: '160.00', image: postres },
    ] 
  },
  { 
    id: '5', 
    name: 'Bebidas', 
    image: bebidasR, 
    dishes: [
      { id: '1', name: 'Bebida 1', description: 'Descripción breve del platillo', price: '30.00', image: bebidas },
      { id: '2', name: 'Bebida 2', description: 'Descripción breve del platillo', price: '40.00', image: bebidas },
      { id: '3', name: 'Bebida 3', description: 'Descripción breve del platillo', price: '50.00', image: bebidas },
      { id: '4', name: 'Bebida 4', description: 'Descripción breve del platillo', price: '60.00', image: bebidas },
      { id: '5', name: 'Bebida 5', description: 'Descripción breve del platillo', price: '70.00', image: bebidas },
      { id: '6', name: 'Bebida 6', description: 'Descripción breve del platillo', price: '80.00', image: bebidas },
      { id: '7', name: 'Bebida 7', description: 'Descripción breve del platillo', price: '90.00', image: bebidas },
      { id: '8', name: 'Bebida 8', description: 'Descripción breve del platillo', price: '100.00', image: bebidas },
      { id: '9', name: 'Bebida 9', description: 'Descripción breve del platillo', price: '110.00', image: bebidas },
      { id: '10', name: 'Bebida 10', description: 'Descripción breve del platillo', price: '120.00', image: bebidas },
      { id: '11', name: 'Bebida 11', description: 'Descripción breve del platillo', price: '130.00', image: bebidas },
      { id: '12', name: 'Bebida 12', description: 'Descripción breve del platillo', price: '140.00', image: bebidas },
    ] 
  },
  { 
    id: '6', 
    name: 'Cocteles', 
    image: coctelesR, 
    dishes: [
      { id: '1', name: 'Coctel 1', description: 'Descripción breve del platillo', price: '45.00', image: coctelesR },
      { id: '2', name: 'Coctel 2', description: 'Descripción breve del platillo', price: '55.00', image: coctelesR },
      { id: '3', name: 'Coctel 3', description: 'Descripción breve del platillo', price: '65.00', image: coctelesR },
      { id: '4', name: 'Coctel 4', description: 'Descripción breve del platillo', price: '75.00', image: coctelesR },
      { id: '5', name: 'Coctel 5', description: 'Descripción breve del platillo', price: '85.00', image: coctelesR },
      { id: '6', name: 'Coctel 6', description: 'Descripción breve del platillo', price: '95.00', image: coctelesR },
      { id: '7', name: 'Coctel 7', description: 'Descripción breve del platillo', price: '105.00', image: coctelesR },
      { id: '8', name: 'Coctel 8', description: 'Descripción breve del platillo', price: '115.00', image: coctelesR },
      { id: '9', name: 'Coctel 9', description: 'Descripción breve del platillo', price: '125.00', image: coctelesR },
      { id: '10', name: 'Coctel 10', description: 'Descripción breve del platillo', price: '135.00', image: coctelesR },
      { id: '11', name: 'Coctel 11', description: 'Descripción breve del platillo', price: '145.00', image: coctelesR },
      { id: '12', name: 'Coctel 12', description: 'Descripción breve del platillo', price: '155.00', image: coctelesR },
    ] 
  }
];