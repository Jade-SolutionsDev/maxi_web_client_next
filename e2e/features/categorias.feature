# language: es
Característica: Directorio de categorías

  El catálogo se organiza en departamentos, y cada departamento agrupa sus
  categorías. El directorio existe para que alguien que no sabe qué busca pueda
  llegar igualmente al producto.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega
    Y que existe un producto "Cola" con 25 unidades y un 0% de rebaja

  Escenario: El directorio muestra el departamento y su categoría
    Cuando el cliente abre "/categorias"
    Entonces ve el departamento del producto "Cola"
    Y ve la categoría del producto "Cola"

  Escenario: Desde una categoría se llega a sus productos
    Cuando el cliente abre el catálogo filtrando por la categoría de "Cola"
    Entonces ve el producto "Cola"
