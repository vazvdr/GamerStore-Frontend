import Image from 'next/image';
import Link from 'next/link';

export default function LogoRodape() {
  return (
    <Link href="/" className="flex items-center gap-3">
      {/* Ícone da logo - Sempre visível */}
      <Image src="/logo.png" height={60} width={60} alt="logo" />
      
      {/* Texto da logo - Escondido em telas menores */}
      <Image
        src="/logo-texto.png"
        width={230}
        height={0}
        alt="logo texto"
        className=""
      />
    </Link>
  );
}
