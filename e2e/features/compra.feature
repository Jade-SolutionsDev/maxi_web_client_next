# language: es
@sesion
Característica: Comprar con la sesión iniciada

  Quien ya entró a su cuenta compra de verdad: el carrito deja de vivir en el
  navegador y pasa al servidor, el pedido se crea con su número y su estado, y
  puede volver a verlo —o cancelarlo— desde su historial.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega
    Y que existe un producto "Cola" con 25 unidades y un 0% de rebaja
    Y que el cliente no tiene pedidos ni carrito

  Escenario: El carrito de un cliente sobrevive a recargar
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y recarga la página
    Entonces el carrito contiene 1 artículo

  Escenario: Comprar lo que hay en el carrito
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y escribe "Calle 23 #456, entre 8 y 10" como dirección de entrega
    Y confirma el pedido
    Entonces ve su pedido recién creado
    Y el pedido está "Pendiente"
    Y el pedido espera el pago

  Escenario: El pedido comprado aparece en el historial
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y escribe "Calle 23 #456, entre 8 y 10" como dirección de entrega
    Y confirma el pedido
    Y abre su historial de pedidos
    Entonces el historial incluye ese pedido

  Escenario: Comprar vacía el carrito
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y escribe "Calle 23 #456, entre 8 y 10" como dirección de entrega
    Y confirma el pedido
    Y abre el carrito
    Entonces el carrito queda vacío

  Escenario: Cancelar un pedido todavía pendiente
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y escribe "Calle 23 #456, entre 8 y 10" como dirección de entrega
    Y confirma el pedido
    Y pulsa cancelar el pedido
    Entonces se le advierte que se libera el stock reservado
    Cuando confirma la cancelación
    Entonces el pedido está "Cancelado"

  Escenario: Finalizar la compra sin nada en el carrito devuelve al catálogo
    Cuando el cliente abre "/checkout"
    Entonces acaba en el catálogo
