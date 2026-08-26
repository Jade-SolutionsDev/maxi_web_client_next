# language: es
Característica: La tienda pregunta la zona antes de mostrar el catálogo

  El catálogo depende del almacén que sirve a cada zona: lo que hay en La Habana
  no tiene por qué haberlo en Artemisa. Por eso la tienda pide la zona antes de
  enseñar nada, y la recuerda para las siguientes visitas.

  Escenario: A quien llega sin zona elegida se le pregunta
    Dado que el cliente no ha elegido zona
    Cuando el cliente abre el catálogo
    Entonces se le pide que elija su zona

  Escenario: Elegida la zona, se muestra en la cabecera
    Dado que el cliente ha elegido una zona con entrega
    Cuando el cliente abre el catálogo
    Entonces no se le pide que elija su zona
    Y la cabecera muestra su zona

  Escenario: Solo se ofrecen zonas a las que se entrega
    Dado que el cliente ha elegido una zona con entrega
    Cuando el cliente abre el catálogo
    Y abre el selector de zona
    Entonces solo puede elegir provincias con entrega

  Escenario: Con una zona a la que ya no se entrega, no hay nada que ofrecer
    Dado que el cliente tiene guardada una zona sin entrega
    Y que existe un producto "Cola" con 25 unidades y un 0% de rebaja
    Cuando el cliente abre el catálogo
    Entonces no ve el producto "Cola"

  Escenario: Buscar desde la cabecera encuentra el producto
    Dado que el cliente ha elegido una zona con entrega
    Y que existe un producto "Cola" con 25 unidades y un 0% de rebaja
    Cuando el cliente abre el catálogo
    Y busca "Cola" desde la cabecera
    Entonces ve el producto "Cola"
