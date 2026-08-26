# language: es
Característica: La ficha de un producto

  La ficha es la última pantalla antes de añadir algo al carrito. Tiene que
  decir el precio que se va a cobrar, dejar elegir cuánto, y sobrevivir a los
  enlaces viejos: un producto que cambia de nombre cambia de dirección, y los
  enlaces que ya circulaban tienen que seguir llevando a él.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega
    Y que existe un producto "Cola" con 25 unidades y un 20% de rebaja

  Escenario: La ficha muestra el precio que se va a cobrar
    Cuando el cliente abre la ficha de "Cola"
    Entonces ve el producto "Cola"
    Y ve el precio "US$80.00"

  Escenario: Se puede llenar el carrito desde la ficha
    Cuando el cliente abre la ficha de "Cola"
    Y añade 2 unidades desde la ficha
    Entonces el carrito contiene 2 artículos

  Escenario: Un enlace viejo lleva a la dirección actual del producto
    Cuando el cliente abre la ficha de "Cola" por su identificador
    Entonces acaba en la dirección de "Cola"

  # La tienda responde 200 con la pantalla de "no encontrado", en vez de un 404
  # de verdad. Es el mismo fallo que MxH-0087, aqui en las fichas: mientras siga
  # asi, esto comprueba lo unico que hoy es cierto — que al cliente se le dice.
  Escenario: Una dirección sin identificador no es una ficha
    Cuando el cliente abre "/catalog/cola-inventada"
    Entonces se le dice que la página no existe
