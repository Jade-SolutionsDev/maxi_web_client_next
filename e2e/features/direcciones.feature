# language: es
@sesion
Característica: Direcciones guardadas del cliente

  Guardar una dirección sirve para que la segunda compra no cueste lo mismo que
  la primera. La primera que se guarda queda como predeterminada, porque un
  cliente con direcciones y ninguna elegida no tiene respuesta al pagar.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega
    Y que el cliente no tiene ninguna dirección guardada

  Escenario: Sin direcciones, se invita a guardar la primera
    Cuando el cliente abre "/direcciones"
    Entonces se le dice que todavía no tiene direcciones guardadas

  Escenario: La primera dirección que se guarda queda como predeterminada
    Cuando el cliente abre "/direcciones"
    Y guarda una dirección llamada "Casa" en la calle "Calle 23 #456"
    Entonces ve la dirección "Casa"
    Y la dirección "Casa" está marcada como predeterminada

  Escenario: La dirección muestra sus datos completos
    Cuando el cliente abre "/direcciones"
    Y guarda una dirección llamada "Casa" en la calle "Calle 23 #456"
    Entonces ve la calle "Calle 23 #456"
    Y ve su municipio y provincia

  Escenario: La segunda dirección no arrebata la predeterminada
    Cuando el cliente abre "/direcciones"
    Y guarda una dirección llamada "Casa" en la calle "Calle 23 #456"
    Y guarda una dirección llamada "Trabajo" en la calle "Ave 51 #2202"
    Entonces la dirección "Casa" está marcada como predeterminada
    Y la dirección "Trabajo" no está marcada como predeterminada

  Escenario: Se puede cambiar cuál es la predeterminada
    Cuando el cliente abre "/direcciones"
    Y guarda una dirección llamada "Casa" en la calle "Calle 23 #456"
    Y guarda una dirección llamada "Trabajo" en la calle "Ave 51 #2202"
    Y marca "Trabajo" como predeterminada
    Entonces la dirección "Trabajo" está marcada como predeterminada
    Y la dirección "Casa" no está marcada como predeterminada

  Escenario: Borrar una dirección pide confirmación
    Cuando el cliente abre "/direcciones"
    Y guarda una dirección llamada "Casa" en la calle "Calle 23 #456"
    Y pulsa borrar en la dirección "Casa"
    Entonces se le pide confirmación antes de borrar

  Escenario: Al borrar la predeterminada, otra ocupa su lugar
    Cuando el cliente abre "/direcciones"
    Y guarda una dirección llamada "Casa" en la calle "Calle 23 #456"
    Y guarda una dirección llamada "Trabajo" en la calle "Ave 51 #2202"
    Y borra la dirección "Casa"
    Entonces no ve la dirección "Casa"
    Y la dirección "Trabajo" está marcada como predeterminada
