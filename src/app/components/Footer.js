import { Footer, FooterLink, FooterLinkGroup } from "flowbite-react";
import Image from "next/image";

export default function AppFooter() {
  return (
    <Footer className="bg-white" container={true}>
      <div className="w-full flex justify-center items-center">
        <Image
          src="/images/logo.png"
          alt="PokéDoc logo"
          width={25}
          height={25}
          className="h-auto"
          draggable="false"
          priority
          onClick={() => router.push("/")}
        />
        <FooterLinkGroup className="ml-6 space-x-6 text-black">
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/credits">Credits</FooterLink>
          <FooterLink href="/apropos">A propos</FooterLink>
          <FooterLink href="/mentions-legales">Mention legale</FooterLink>
        </FooterLinkGroup>
      </div>
    </Footer>
  );
}
