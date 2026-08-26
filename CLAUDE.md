@AGENTS.md


Siempre ten en cuenta aplicar la S de SOLID en tu código. Esto significa que cada clase, función o módulo debe tener una única responsabilidad y no mezclar diferentes responsabilidades en un solo lugar. Esto facilita el mantenimiento y la escalabilidad del código.

## Helpers compartidos

Antes de escribir cualquier función utilitaria (formateo, cálculo, transformación
de datos), revisá `src/helpers.ts`. Si ya existe, importala; no la redeclares
localmente dentro de un componente ni en otro módulo.

Si la función es genérica y reutilizable, agregala a `src/helpers.ts` en lugar de
dejarla suelta donde la necesitaste. Cada helper duplicado es una definición más
que se puede desincronizar.

## Comentarios en el código

No comentes el código. Ni comentarios de línea, ni bloques JSDoc, ni comentarios
dentro del JSX. Escribí código que se explique solo: nombres claros, funciones
chicas y una sola responsabilidad por módulo.

Solo agregá un comentario cuando se pida de forma explícita en ese pedido puntual.
Una autorización previa no habilita los siguientes cambios.

Esto no aplica a los comentarios que ya existen en el repositorio: no los borres
salvo que el código que documentan haya dejado de existir.


## Español de Cuba (obligatorio)

Todo el texto en español que ve una persona —storefront, back-office, mensajes
de la API, correos, textos sembrados en la base de datos— se escribe en el
español de Cuba, que **tutea**. Nunca voseo rioplatense: suena ajeno al cliente.

- Imperativos: **elige**, **paga**, **envía**, **recoge**, **escríbenos**,
  **confirma**, **ajusta**, **guarda**, **cambia**, **contacta**.
  Nunca *elegí*, *pagá*, *enviá*, *recogé*, *escribinos*, *confirmá*.
- Pronombres y verbos: **tú**, **tienes**, **quieres**, **puedes**, **buscas**,
  **contigo**. Nunca *vos*, *tenés*, *querés*, *podés*, *buscás*, *con vos*.
- Vale el "usted" cuando el tono lo pida, pero nunca se mezcla con el voseo.

Aplica igual a los tests: si una aserción busca un texto, se escribe como el
texto real. Los datos ya sembrados en una base de datos existente no se
actualizan solos — cámbialos desde el back-office.
