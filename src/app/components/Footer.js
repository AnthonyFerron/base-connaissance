
import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

export default function AppFooter() {
  return (
    <Footer className="bg-gray-50" container={true}>
        <div className="w-full flex justify-center">
      <FooterCopyright href="#" by="PokéDoc" />
      <FooterLinkGroup className="ml-6 space-x-6">
        <FooterLink href="#">Contact</FooterLink>
        <FooterLink href="#">Credits</FooterLink>
        <FooterLink href="#">A propos</FooterLink>
        <FooterLink href="#">Mention legale</FooterLink>
      </FooterLinkGroup>
        </div>
    </Footer>
  );
}
