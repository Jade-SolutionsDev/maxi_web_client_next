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
    Y que el cliente tiene una dirección guardada

  Escenario: El carrito de un cliente sobrevive a recargar
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y recarga la página
    Entonces el carrito contiene 1 artículo

  Escenario: Una dirección guardada trae ya los datos de quien recibe
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Entonces los datos de quien recibe vienen puestos

  Escenario: No se puede comprar sin decir a quién se entrega
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y borra los datos de quien recibe
    Y pulsa confirmar el pedido
    Entonces el pedido no se crea
    Y se le dice que falta el nombre

  Escenario: Un carnet con una fecha que no existe no vale
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y escribe un carnet imposible
    Y pulsa confirmar el pedido
    Entonces el pedido no se crea
    Y se le dice que falta el carnet

  Escenario: Recoger en tienda también pide quién recoge
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y elige recoger en tienda
    Entonces también le piden quién recoge

  Escenario: Volver a por más cosas sin perder lo que ya se lleva
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y pulsa seguir comprando
    Entonces acaba en el catálogo
    Y el carrito contiene 1 artículo

  Escenario: Comprar lo que hay en el carrito
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y elige su dirección guardada
    Y confirma el pedido
    Entonces ve su pedido recién creado
    Y el pedido está "Pendiente"
    Y el pedido espera el pago

  Escenario: El pedido comprado aparece en el historial
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y elige su dirección guardada
    Y confirma el pedido
    Y abre su historial de pedidos
    Entonces el historial incluye ese pedido

  Escenario: Comprar vacía el carrito
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y elige su dirección guardada
    Y confirma el pedido
    Y abre el carrito
    Entonces el carrito queda vacío

  Escenario: Cancelar un pedido todavía pendiente
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y elige su dirección guardada
    Y confirma el pedido
    Y pulsa cancelar el pedido
    Entonces se le advierte que se libera el stock reservado
    Cuando confirma la cancelación
    Entonces el pedido está "Cancelado"

  Escenario: Finalizar la compra sin nada en el carrito devuelve al catálogo
    Cuando el cliente abre "/checkout"
    Entonces acaba en el catálogo

  Escenario: El pedido dice cómo pagarlo
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y elige su dirección guardada
    Y confirma el pedido
    Entonces ve cómo pagar el pedido

  Escenario: Recoger en el almacén sale gratis
    Cuando el cliente abre el catálogo
    Y añade el primer producto al carrito
    Y abre el carrito
    Y pulsa proceder al pago
    Y elige recoger en el almacén
    Entonces el envío no se cobra
    Cuando confirma el pedido
    Entonces ve su pedido recién creado
