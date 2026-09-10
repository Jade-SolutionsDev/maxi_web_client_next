"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { guardarConsentimiento } from "@/shared/cookies/action/consent.action";
import {
  CATEGORIAS,
  CATEGORIAS_OPCIONALES,
  type CategoriaCookie,
} from "@/shared/cookies/consent";

export const RUTA_POLITICA = "/paginas/politica-de-cookies";

/**
 * El enlace del pie y el panel viven en ramas distintas del arbol y no hay
 * estado compartido entre ellas. Un evento del navegador los une sin montar un
 * proveedor de contexto alrededor de toda la aplicacion para una sola cosa.
 */
export const EVENTO_ABRIR_COOKIES = "maxi:configurar-cookies";

interface CookieNoticeProps {
  /** Falso cuando ya hay una decisión guardada: entonces solo vive el panel. */
  pendiente: boolean;
  aceptadas: CategoriaCookie[];
  /** Lo abre el enlace del pie; el aviso trae el suyo propio. */
  abrirPanel?: boolean;
  onCerrarPanel?: () => void;
}

export const CookieNotice = ({
  pendiente,
  aceptadas,
  abrirPanel = false,
  onCerrarPanel,
}: CookieNoticeProps) => {
  const [visible, setVisible] = useState(pendiente);
  const [despejado, setDespejado] = useState(false);
  const barra = useRef<HTMLDivElement>(null);
  const [panelAbierto, setPanelAbierto] = useState(abrirPanel);
  const [seleccion, setSeleccion] = useState<CategoriaCookie[]>(aceptadas);
  const [guardando, empezar] = useTransition();

  /**
   * Una cosa cada vez. Mientras haya un dialogo abierto —el de la zona en la
   * primera visita, el de este mismo panel— la barra espera. Se observa el DOM
   * en lugar de consultar al servidor porque el layout raiz no se vuelve a
   * pedir al elegir zona, y preguntando alli el aviso llegaba una navegacion
   * tarde.
   */
  useEffect(() => {
    /**
     * Solo cuentan los dialogos que se ven. El menu movil y otros paneles
     * quedan montados en el DOM con `role="dialog"` aunque esten cerrados, y
     * mirarlos por el selector a secas dejaba el aviso escondido para siempre
     * en telefono.
     */
    const hayDialogo = () =>
      Array.from(
        document.querySelectorAll('[role="dialog"], [role="alertdialog"]'),
      ).some((el) =>
        el instanceof HTMLElement && typeof el.checkVisibility === "function"
          ? el.checkVisibility()
          : el.getClientRects().length > 0,
      );
    const revisar = () => setDespejado(!hayDialogo());

    revisar();
    const observador = new MutationObserver(revisar);
    observador.observe(document.body, { childList: true, subtree: true });
    return () => observador.disconnect();
  }, []);

  /**
   * Mientras la barra este puesta, el contenido termina mas arriba.
   *
   * Es fija y se apoya en el borde inferior, asi que sin esto se come lo
   * ultimo de cada pagina: los botones de borrar una direccion quedaban
   * debajo y no habia forma de pulsarlos. Se mide en vez de fijar un alto
   * porque en telefono el texto ocupa tres lineas y los botones se apilan.
   */
  useEffect(() => {
    if (!(visible && despejado)) return;

    const alto = barra.current?.offsetHeight ?? 0;
    const previo = document.body.style.paddingBottom;
    document.body.style.paddingBottom = `${alto}px`;

    return () => {
      document.body.style.paddingBottom = previo;
    };
  }, [visible, despejado]);

  useEffect(() => {
    const abrir = () => setPanelAbierto(true);
    window.addEventListener(EVENTO_ABRIR_COOKIES, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_COOKIES, abrir);
  }, []);

  const cerrarPanel = (abierto: boolean) => {
    setPanelAbierto(abierto);
    if (!abierto) onCerrarPanel?.();
  };

  const decidir = (elegidas: CategoriaCookie[]) => {
    setSeleccion(elegidas);
    empezar(async () => {
      await guardarConsentimiento(elegidas);
      setVisible(false);
      cerrarPanel(false);
    });
  };

  const alternar = (id: CategoriaCookie) =>
    setSeleccion((previa) =>
      previa.includes(id)
        ? previa.filter((otra) => otra !== id)
        : [...previa, id],
    );

  const todas = CATEGORIAS_OPCIONALES.map((c) => c.id);

  return (
    <>
      {visible && despejado && (
        <div
          ref={barra}
          role="region"
          aria-label="Aviso de cookies"
          /*
            En telefono se apoya justo encima de la barra de navegacion
            inferior (`h-14`, y solo existe por debajo de `md`), o la
            taparia entera: sin Inicio, Catalogo, Carrito ni Menu.
          */
          className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-input bg-background/95 backdrop-blur-sm md:bottom-0"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
            <Cookie
              className="hidden size-6 shrink-0 text-primary sm:block"
              aria-hidden="true"
            />
            <p className="min-w-0 flex-1 text-sm text-heading">
              Usamos cookies para mantener tu sesión, recordar tu zona y guardar
              tu carrito.{" "}
              <strong className="font-semibold">
                No usamos cookies de publicidad ni de seguimiento.
              </strong>{" "}
              <Link
                href={RUTA_POLITICA}
                className="underline underline-offset-2 hover:text-primary"
              >
                Política de cookies
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPanelAbierto(true)}
                disabled={guardando}
              >
                Configurar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => decidir([])}
                loading={guardando}
              >
                Rechazar no necesarias
              </Button>
              <Button
                size="sm"
                onClick={() => decidir(todas)}
                loading={guardando}
              >
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={panelAbierto} onOpenChange={cerrarPanel}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurar cookies</DialogTitle>
            <DialogDescription>
              Esto es todo lo que Maxi Habana guarda en tu dispositivo. Nada
              más.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {CATEGORIAS.map((categoria) => (
              <section
                key={categoria.id}
                className="rounded-xl border border-input p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-heading">
                      {categoria.titulo}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {categoria.descripcion}
                    </p>
                  </div>
                  {categoria.obligatoria ? (
                    <span className="shrink-0 rounded-lg bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                      Siempre activas
                    </span>
                  ) : (
                    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-input accent-primary"
                        checked={seleccion.includes(categoria.id)}
                        onChange={() => alternar(categoria.id)}
                      />
                      Activar
                    </label>
                  )}
                </div>

                <ul className="mt-3 flex flex-col gap-2 border-t border-input pt-3">
                  {categoria.cookies.map((cookie) => (
                    <li key={cookie.nombre} className="text-xs text-muted">
                      <span className="font-medium text-heading">
                        {cookie.nombre}
                      </span>
                      {" · "}
                      {cookie.proveedor}
                      {" · "}
                      {cookie.duracion}
                      <br />
                      {cookie.proposito}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {CATEGORIAS_OPCIONALES.length === 0 && (
              <p className="rounded-xl bg-surface p-4 text-sm text-heading">
                Ahora mismo <strong>no hay nada opcional que elegir</strong>: la
                tienda no usa cookies de análisis ni de publicidad. Si algún día
                las usara, aparecerían aquí y tendrías que aceptarlas antes de
                que se activen.
              </p>
            )}
          </div>

          <DialogFooter>
            <Link
              href={RUTA_POLITICA}
              className="mr-auto self-center text-sm underline underline-offset-2 hover:text-primary"
            >
              Leer la política de cookies
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => decidir([])}
              loading={guardando}
            >
              Rechazar no necesarias
            </Button>
            <Button
              size="sm"
              onClick={() => decidir(seleccion)}
              loading={guardando}
            >
              Guardar preferencias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
