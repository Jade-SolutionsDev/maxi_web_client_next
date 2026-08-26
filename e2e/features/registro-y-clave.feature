# language: es
Característica: Crear una cuenta y recuperar la contraseña

  La cuenta se pide al pagar, así que crearla es el último paso antes de una
  venta: si falla ahí, se pierde el pedido. Y quien olvida su contraseña tiene
  que poder volver a entrar sin escribirle a nadie.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega

  @captcha
  Escenario: Crear una cuenta pide confirmar el correo
    Cuando el cliente abre "/register"
    Y rellena el registro con una cuenta nueva
    Entonces se le pide que revise su correo

  @captcha
  Escenario: Un correo ya registrado no crea otra cuenta
    Dado que ya existe una cuenta de prueba
    Cuando el cliente abre "/register"
    Y rellena el registro con esa misma cuenta
    Entonces se le avisa "Ya existe una cuenta con ese correo"

  Escenario: Las contraseñas tienen que coincidir
    Cuando el cliente abre "/register"
    Y rellena el registro con dos contraseñas distintas
    Entonces se le avisa "Las contraseñas no coinciden"

  Escenario: Recuperar la contraseña con el código que llega por correo
    Dado que ya existe una cuenta de prueba
    Cuando el cliente abre "/reset-password"
    Y pide el código para esa cuenta
    Y escribe el código y una contraseña nueva
    Entonces entra a la tienda
