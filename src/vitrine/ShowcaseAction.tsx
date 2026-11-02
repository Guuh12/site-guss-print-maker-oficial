import { MessageCircle } from "lucide-react";
import { productWhatsAppMessage, whatsAppLink } from "@/vitrine/whatsapp";

type ShowcaseActionProps = {
  productName: string;
  className?: string;
};

const ShowcaseAction = ({ productName, className }: ShowcaseActionProps) => (
  <a
    href={whatsAppLink(productWhatsAppMessage(productName))}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
  >
    <MessageCircle className="w-4 h-4" />
    Chamar no WhatsApp
  </a>
);

export default ShowcaseAction;
