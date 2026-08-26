# language: es
Característica: Carrito de quien todavía no ha iniciado sesión

  Cualquiera puede llenar el carrito sin cuenta: mirar y elegir no exige
  registrarse. La cuenta se pide al pagar, no antes, y lo que se eligió no se
  pierde por el camino.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega
    Y que existe un producto "Cola" con 25 unidades y un 0% de rebaja

  Escenario: Añadir un producto desde el catálogo
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Entonces se le confirma que el producto se añadió
    Y el carrito contiene 1 artículo

  Escenario: El carrito muestra lo elegido con su total
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Entonces el carrito muestra el producto "Cola"
    Y el carrito muestra un total de "US$100.00"

  Escenario: Añadir dos veces el mismo producto suma cantidades
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y añade el primer producto al carrito
    Entonces el carrito contiene 2 artículos

  Escenario: Lo elegido sigue ahí al recargar la página
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y recarga la página
    Entonces el carrito contiene 1 artículo

  Escenario: Vaciar el carrito
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y vacía el carrito
    Entonces el carrito queda vacío

  Escenario: Pagar exige haber iniciado sesión
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Entonces acaba en la pantalla de acceso

  Escenario: Subir la cantidad desde el carrito
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y agrega una unidad de "Cola"
    Entonces el carrito contiene 2 artículos

  Escenario: Quitar el único producto deja el carrito vacío
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y elimina "Cola" del carrito
    Entonces el carrito queda vacío
