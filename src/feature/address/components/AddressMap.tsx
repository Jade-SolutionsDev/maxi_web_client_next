'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect, useRef } from 'react';
import type { AddressLocation } from '../type/address.interface';

/**
 * El mapa, y **el único fichero que importa Leaflet**. Se carga con
 * `next/dynamic` y `ssr: false` desde `AddressLocationField`: Leaflet necesita
 * `window` y rompe el renderizado en servidor, y además así el paquete no se
 * descarga hasta que alguien abre el mapa.
 *
 * Este componente no decide nada: pinta el punto que le dan y avisa del que el
 * dedo deja. Quién lo guarda, cuándo y con qué procedencia es asunto del campo
 * del formulario.
 */

/**
 * Centro de La Habana, para abrir el mapa cuando la dirección no tiene punto.
 *
 * Se valoró centrarlo en el municipio que el cliente ya eligió en el
 * formulario, que sería mejor primer gesto, y se dejó fuera a propósito: el
 * catálogo de geografía **no guarda coordenadas**, así que habría que sembrar
 * los centros de los municipios, y eso es una migración de la API metida dentro
 * de una tarjeta de la tienda. El botón «usar mi ubicación» cubre el caso real,
 * que es alguien marcando su propia casa.
 */
const LA_HABANA: [number, number] = [23.1136, -82.3666];

const ZOOM_CIUDAD = 13;
const ZOOM_PUNTO = 17;

/**
 * Un pin dibujado, no una imagen. El icono por omisión de Leaflet se sirve por
 * rutas relativas al CSS, que el empaquetador reescribe, y el resultado es un
 * marcador invisible: el fallo clásico de Leaflet en Next. Con un `divIcon` no
 * hay fichero que perder.
 */
const pin = L.divIcon({
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  html: `<span style="display:block;width:28px;height:28px">
    <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
      <path d="M14 1c-5 0-9 4-9 9 0 6.6 9 17 9 17s9-10.4 9-17c0-5-4-9-9-9z"
            fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
      <circle cx="14" cy="10" r="3.2" fill="#ffffff"/>
    </svg>
  </span>`,
});

interface AddressMapProps {
  /** El punto que hay ahora, o `null` si todavía no hay ninguno. */
  value: AddressLocation | null;
  /** Lo llama cada vez que el punto cambia por un gesto en el mapa. */
  onPick: (coords: { latitude: number; longitude: number }) => void;
}

export default function AddressMap({ value, onPick }: AddressMapProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcador = useRef<L.Marker | null>(null);
  // En un ref y no en las dependencias del efecto: el mapa se monta una vez, y
  // un `onPick` nuevo en cada render no debe desmontarlo.
  const avisar = useRef(onPick);
  avisar.current = onPick;
  /**
   * El punto con el que se abrió, congelado. El efecto de montaje tiene que
   * leerlo para centrar la primera vista, y si dependiera de `value` el mapa se
   * desmontaría y volvería a montarse con cada gesto del dedo. El que llega
   * después lo recoge el efecto de sincronización.
   */
  const inicial = useRef(value);

  useEffect(() => {
    if (!contenedor.current || mapa.current) return;

    const abre = inicial.current;

    const instancia = L.map(contenedor.current, {
      center: abre ? [abre.latitude, abre.longitude] : LA_HABANA,
      zoom: abre ? ZOOM_PUNTO : ZOOM_CIUDAD,
      // El zoom con la rueda dentro de un panel que se desplaza secuestra el
      // gesto; los botones + y − siguen ahí, y en el teléfono se pellizca.
      scrollWheelZoom: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      // Obligatoria por licencia, no decorativa.
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    }).addTo(instancia);

    const colocar = (lat: number, lng: number) => {
      avisar.current({ latitude: lat, longitude: lng });
    };

    instancia.on('click', (evento: L.LeafletMouseEvent) => {
      colocar(evento.latlng.lat, evento.latlng.lng);
    });

    mapa.current = instancia;

    /**
     * Leaflet mide el contenedor **al crearse**, y a partir de ahí calcula
     * contra ese tamaño: si luego cambia, las teselas no cubren y los clics se
     * descolocan. Un `ResizeObserver` y no un `invalidateSize()` a secas,
     * porque así también sobrevive a girar el teléfono o a que el teclado abra
     * y cierre.
     *
     * No es la causa del mapa de altura 0 que apareció al probarlo el
     * 18-oct-2026 —eso era especificidad de CSS en el panel, y está arreglado
     * allí—, pero esto hace falta igual.
     */
    const observador = new ResizeObserver(() => instancia.invalidateSize());
    observador.observe(contenedor.current);

    return () => {
      observador.disconnect();
      instancia.remove();
      mapa.current = null;
      marcador.current = null;
    };
  }, []);

  // El marcador sigue al valor, venga de un clic en el mapa o del botón de
  // «usar mi ubicación», que vive fuera de este componente.
  useEffect(() => {
    const instancia = mapa.current;
    if (!instancia) return;

    if (!value) {
      marcador.current?.remove();
      marcador.current = null;
      return;
    }

    const destino: [number, number] = [value.latitude, value.longitude];

    if (!marcador.current) {
      const nuevo = L.marker(destino, {
        icon: pin,
        draggable: true,
        keyboard: true,
      });

      nuevo.on('dragend', () => {
        const { lat, lng } = nuevo.getLatLng();
        avisar.current({ latitude: lat, longitude: lng });
      });

      nuevo.addTo(instancia);
      marcador.current = nuevo;
    } else {
      marcador.current.setLatLng(destino);
    }

    // Solo mueve la vista si el punto se salió de ella: arrastrando el
    // marcador el mapa no debe perseguirlo y marear.
    if (!instancia.getBounds().contains(destino)) {
      instancia.setView(destino, Math.max(instancia.getZoom(), ZOOM_PUNTO));
    }
  }, [value]);

  return (
    <div
      ref={contenedor}
      // `touch-action` lo gestiona Leaflet; la altura la fija el panel.
      className='h-full w-full'
      role='application'
      aria-label='Mapa para marcar la ubicación. Toca o arrastra el marcador.'
    />
  );
}
