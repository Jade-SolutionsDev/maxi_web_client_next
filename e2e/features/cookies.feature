# language: es
Característica: Aviso y configuración de cookies

  A quien llega se le dice qué se guarda en su dispositivo y se le deja
  decidir. La tienda no usa cookies de publicidad ni de seguimiento, así que el
  panel no inventa categorías: enseña lo que hay, que es poco, y lo dice.

  Escenario: A quien llega sin zona no se le encima el aviso
    Dado que el cliente no ha elegido zona
    Cuando el cliente abre el catálogo
    Entonces se le pide que elija su zona
    Y todavía no se le muestra el aviso de cookies

  Escenario: Elegida la zona, se le informa
    Dado que el cliente ha elegido una zona con entrega
    Cuando el cliente abre el catálogo
    Entonces se le muestra el aviso de cookies
    Y el aviso ofrece aceptar, rechazar y configurar

  Escenario: Aceptar y que no vuelva a preguntar
    Dado que el cliente ha elegido una zona con entrega
    Cuando el cliente abre el catálogo
    Y acepta las cookies
    Y recarga la página
    Entonces ya no se le muestra el aviso de cookies

  Escenario: Rechazar también es una respuesta
    Dado que el cliente ha elegido una zona con entrega
    Cuando el cliente abre el catálogo
    Y rechaza las cookies no necesarias
    Y recarga la página
    Entonces ya no se le muestra el aviso de cookies

  Escenario: El panel enseña lo que se guarda de verdad
    Dado que el cliente ha elegido una zona con entrega
    Cuando el cliente abre el catálogo
    Y abre la configuración de cookies
    Entonces el panel nombra las cookies que la tienda usa
    Y las necesarias no se pueden desactivar

  Escenario: La decisión se puede cambiar después
    Dado que el cliente ha elegido una zona con entrega
    Cuando el cliente abre el catálogo
    Y acepta las cookies
    Y abre la configuración de cookies desde el pie
    Entonces el panel nombra las cookies que la tienda usa
