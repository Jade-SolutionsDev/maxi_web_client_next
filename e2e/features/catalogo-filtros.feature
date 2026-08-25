# language: es
Característica: Ordenar, filtrar y pasar de página en el catálogo

  El catálogo de una tienda de barrio se recorre buscando: por precio, por
  ofertas, y pasando páginas cuando hay más de lo que cabe en una.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega

  Escenario: Ordenar por precio pone primero lo más barato
    Dado que existe un producto "Barato" de US$50 con 10 unidades
    Y que existe un producto "Caro" de US$300 con 10 unidades
    Cuando el cliente abre el catálogo
    Y ordena por "Precio: menor a mayor"
    Entonces el primer producto de la lista es "Barato"

  Escenario: Ordenar por precio al revés pone primero lo más caro
    Dado que existe un producto "Barato" de US$50 con 10 unidades
    Y que existe un producto "Caro" de US$300 con 10 unidades
    Cuando el cliente abre el catálogo
    Y ordena por "Precio: mayor a menor"
    Entonces el primer producto de la lista es "Caro"

  Escenario: Filtrar por ofertas deja solo lo rebajado
    Dado que existe un producto "Rebajado" de US$100 con 10 unidades y un 30% de rebaja
    Y que existe un producto "Entero" de US$100 con 10 unidades
    Cuando el cliente abre el catálogo
    Y filtra por productos en oferta
    Entonces ve el producto "Rebajado"
    Y no ve el producto "Entero"

  Escenario: Con más productos de los que caben, aparece la segunda página
    Dado que existen 13 productos con existencias
    Cuando el cliente abre el catálogo
    Entonces la lista muestra 12 productos
    Y hay una segunda página
    Cuando pasa a la segunda página
    Entonces la lista muestra 1 producto
