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
