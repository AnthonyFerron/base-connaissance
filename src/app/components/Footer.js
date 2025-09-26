
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
                    className=""
                    draggable="false"
                    priority
                    href="/"
                  />
      <FooterLinkGroup className="ml-6 space-x-6 text-black">
        <FooterLink href="#">Contact</FooterLink>
        <FooterLink href="#">Credits</FooterLink>
        <FooterLink href="#">A propos</FooterLink>
        <FooterLink href="#">Mention legale</FooterLink>
      </FooterLinkGroup>
        </div>
    </Footer>
  );
}
