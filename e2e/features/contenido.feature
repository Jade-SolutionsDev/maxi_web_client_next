# language: es
Característica: Páginas de contenido y datos de contacto

  Hay páginas que no vende nadie pero que la tienda necesita: cómo contactar, y
  las páginas legales que se editan desde la administración sin tocar código.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega

  Escenario: La página de contacto muestra cómo escribir y llamar
    Cuando el cliente abre "/contacto"
    Entonces ve el correo de contacto
    Y ve el teléfono de contacto

  Escenario: Una página publicada desde la administración se ve en la tienda
    Dado que existe una página publicada llamada "Política de prueba"
    Cuando el cliente abre esa página
    Entonces la página muestra el título "Política de prueba"
    Y ve su contenido

  Escenario: Una página desactivada no muestra su contenido
    Dado que existe una página desactivada llamada "Borrador interno"
    Cuando el cliente abre esa página
    Entonces no ve su contenido
    # La API responde 404 a una pagina inactiva, pero la tienda devuelve 200 con
    # su propia pantalla de "no encontrado". El contenido no se filtra, pero el
    # codigo de estado enganya a los buscadores. Ver MxH-0087.
