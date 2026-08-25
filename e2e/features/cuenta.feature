# language: es
@sesion
Característica: La cuenta del cliente

  Lo que rodea a las direcciones y los pedidos: que el formulario avise antes
  de guardar una dirección a medias, y que cerrar sesión cierre de verdad.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega

  Escenario: Una dirección sin calle no se guarda
    Dado que el cliente no tiene ninguna dirección guardada
    Cuando abre sus direcciones
    Y abre el formulario de nueva dirección
    Y pulsa guardar la dirección
    Entonces se le avisa "Escribe la calle y el número"
    Y no se guarda ninguna dirección

  Escenario: Una dirección sin municipio no se guarda
    Dado que el cliente no tiene ninguna dirección guardada
    Cuando abre sus direcciones
    Y abre el formulario de nueva dirección
    Y escribe "Calle 23 #456" en "Calle y número"
    Y pulsa guardar la dirección
    Entonces se le avisa "Elige la provincia"
    Y no se guarda ninguna dirección

  Escenario: Un teléfono con letras no se guarda
    Dado que el cliente no tiene ninguna dirección guardada
    Cuando abre sus direcciones
    Y abre el formulario de nueva dirección
    Y escribe "Calle 23 #456" en "Calle y número"
    Y escribe "no es un teléfono" en "Teléfono de contacto"
    Y pulsa guardar la dirección
    Entonces se le avisa "Teléfono no válido"

  @cierra-sesion
  Escenario: Cerrar sesión deja la cuenta fuera del alcance
    Cuando abre sus direcciones
    Y cierra la sesión
    Y el cliente abre "/pedidos"
    Entonces acaba en la pantalla de acceso
