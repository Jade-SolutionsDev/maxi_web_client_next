// La caja fija el alto en cada breakpoint: sin esto el carrusel salta de altura
// al cambiar de slide y la imagen provoca layout shift al terminar de cargar.
// Compartida con el skeleton para que el shell reserve exactamente el mismo alto.
export const bannerFrameClass =
  'relative block w-full aspect-[1081/1609] md:aspect-[745/1048] lg:aspect-[1921/393]';
