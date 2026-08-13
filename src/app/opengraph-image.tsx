import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt =
  'MaxiHabana — tu supermercado online: departamentos, productos destacados y las mejores ofertas del día.';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

const readLogo = async () => {
  const logo = await readFile(
    join(process.cwd(), 'src/assets/logo.svg'),
    'base64',
  );

  return `data:image/svg+xml;base64,${logo}`;
};

export default async function Image() {
  const logoSrc = await readLogo();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        backgroundColor: '#085041',
        backgroundImage:
          'radial-gradient(circle at 15% 15%, #3db98c 0%, transparent 55%), radial-gradient(circle at 85% 90%, #0e9e6e 0%, transparent 50%)',
      }}
    >
      <img src={logoSrc} width={476} height={168} alt='' />

      <div
        style={{
          display: 'flex',
          marginTop: '48px',
          fontSize: 68,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        Tu supermercado online
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: '24px',
          maxWidth: '860px',
          fontSize: 32,
          color: '#e4f5ee',
          textAlign: 'center',
          lineHeight: 1.35,
        }}
      >
        Departamentos, productos destacados y las mejores ofertas del día.
      </div>
    </div>,
    size,
  );
}
