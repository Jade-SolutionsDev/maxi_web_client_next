# language: es
Característica: El catálogo de la tienda refleja lo que hay a la venta

  Lo que la administración pone a la venta tiene que verse en la tienda, y lo que
  no está disponible no puede colarse. Un producto sin existencias en ningún
  almacén no se ofrece, aunque exista en el catálogo.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega
    Y que existe un producto "Cola" con 25 unidades y un 20% de rebaja
    Y que existe un producto "Agotado" sin existencias

  Escenario: Solo se ofrece lo que se puede entregar
    Cuando el cliente abre el catálogo
    Entonces ve el producto "Cola"
    Pero no ve el producto "Agotado"

  Escenario: El precio que se muestra es el rebajado, no el original
    Cuando el cliente abre el catálogo
    Y pulsa sobre el producto "Cola"
    Entonces ve el precio "80"

  Escenario: La API no ofrece productos sin existencias
    Cuando se consultan los productos públicos de la API
    Entonces la respuesta incluye "Cola"
    Y la respuesta no incluye "Agotado"

  Escenario: El precio rebajado lo calcula el servidor
    Cuando se consultan los productos públicos de la API
    Entonces "Cola" tiene precio base 100, rebaja 20 y precio final 80

  Escenario: Buscar un producto por su nombre
    Cuando el cliente busca "Cola" en el catálogo
    Entonces ve el producto "Cola"

  Escenario: Una búsqueda sin resultados lo dice, no deja la página en blanco
    Cuando el cliente busca "zzzzinexistente" en el catálogo
    Entonces no ve el producto "Cola"
    Y la página sigue funcionando
