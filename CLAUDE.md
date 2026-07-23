@AGENTS.md


Siempre ten en cuenta aplicar la S de SOLID en tu código. Esto significa que cada clase, función o módulo debe tener una única responsabilidad y no mezclar diferentes responsabilidades en un solo lugar. Esto facilita el mantenimiento y la escalabilidad del código.

## Helpers compartidos

Antes de escribir cualquier función utilitaria (formateo, cálculo, transformación
de datos), revisá `src/helpers.ts`. Si ya existe, importala; no la redeclares
localmente dentro de un componente ni en otro módulo.

Si la función es genérica y reutilizable, agregala a `src/helpers.ts` en lugar de
dejarla suelta donde la necesitaste. Cada helper duplicado es una definición más
que se puede desincronizar.