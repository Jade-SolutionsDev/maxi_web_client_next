# language: es
Característica: Navegación y acceso a las secciones de la tienda

  Las páginas públicas tienen que cargar para cualquiera, y las que son de la
  cuenta del cliente no pueden abrirse sin haber iniciado sesión.

  Antecedentes:
    Dado que el cliente ha elegido una zona con entrega

  Esquema del escenario: Las páginas públicas cargan
    Cuando el cliente abre "<ruta>"
    Entonces la página muestra el título "<titulo>"

    Ejemplos:
      | ruta            | titulo                       |
      | /               | Maxi — Supermercado online   |
      | /catalog        | Descubre nuestros productos  |
      | /categorias     | Categorías                   |
      | /contacto       | Contacto                     |
      | /sobre-nosotros | Sobre nosotros               |

  Esquema del escenario: Las secciones de la cuenta piden iniciar sesión
    Cuando el cliente abre "<ruta>"
    Entonces acaba en la pantalla de acceso

    Ejemplos:
      | ruta         |
      | /direcciones |
      | /pedidos     |
      | /checkout    |

  Escenario: Una dirección que no existe devuelve 404
    Cuando el cliente abre "/no-existe-esta-ruta"
    Entonces la respuesta es un 404

  Escenario: La portada ofrece sus secciones de producto
    Cuando el cliente abre "/"
    Entonces la portada muestra las secciones de destacados, ofertas y recientes
