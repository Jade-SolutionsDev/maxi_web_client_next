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

  Escenario: Quitar el filtro de ofertas devuelve el catálogo entero
    Dado que existe un producto "Rebajado" de US$100 con 10 unidades y un 30% de rebaja
    Y que existe un producto "Entero" de US$100 con 10 unidades
    Cuando el cliente abre el catálogo
    Y filtra por productos en oferta
    Y quita el filtro de ofertas
    Entonces ve el producto "Rebajado"
    Y ve el producto "Entero"

  # Se filtra por el departamento propio de la siembra a proposito: contar sobre
  # el catalogo entero da por hecho que la base esta vacia, y no lo esta —el
  # fixture del admin y la siembra de demostracion dejan productos dentro—.
  Escenario: Con más productos de los que caben, aparece la segunda página
    Dado que existen 13 productos con existencias
    Cuando el cliente abre el catálogo
    Y filtra por el departamento de "Fila 01"
    Entonces la lista muestra 12 productos
    Y hay una segunda página
    Cuando pasa a la segunda página
    Entonces la lista muestra 1 producto
    Y el filtro de departamento sigue puesto

  Escenario: Filtrar por departamento deja solo sus productos
    Dado que existe un producto "Lácteo" de US$100 con 5 unidades en el departamento "A"
    Y que existe un producto "Ferretero" de US$100 con 5 unidades en el departamento "B"
    Cuando el cliente abre el catálogo
    Y filtra por el departamento de "Lácteo"
    Entonces ve el producto "Lácteo"
    Y no ve el producto "Ferretero"

  Escenario: Bajar el precio máximo deja fuera lo que se pasa
    Dado que existe un producto "Asequible" de US$50 con 5 unidades
    Y que existe un producto "Carísimo" de US$900 con 5 unidades
    Cuando el cliente abre el catálogo
    Y baja el precio máximo a la mitad
    Entonces ve el producto "Asequible"
    Y no ve el producto "Carísimo"

  # El buscador de la cabecera construia su destino igual que la paginacion,
  # desde useSearchParams(): buscar despues de filtrar devolvia el catalogo
  # entero sin decirlo.
  Escenario: Buscar desde la cabecera no tira el departamento ya filtrado
    Dado que existe un producto "Fresco" de US$100 con 5 unidades en el departamento "A"
    Y que existe un producto "Seco" de US$100 con 5 unidades en el departamento "B"
    Cuando el cliente abre el catálogo
    Y filtra por el departamento de "Fresco"
    Y busca "Fresco" desde la cabecera
    Entonces el filtro de departamento sigue puesto
