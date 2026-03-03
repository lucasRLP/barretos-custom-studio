// Product images mapping
import tshirtImg from "@/assets/products/t-shirt.png";
import camisaPoloImg from "@/assets/products/camisa-polo.png";
import camisaSocialImg from "@/assets/products/camisa-social.png";
import moletomCarecaImg from "@/assets/products/moletom-careca.png";
import moletomZiperImg from "@/assets/products/moletom-ziper.png";
import moletomCanguruImg from "@/assets/products/moletom-canguru.png";
import ecobagImg from "@/assets/products/ecobag.png";
import sacochilaImg from "@/assets/products/sacochila.png";
import fitnessDryFitImg from "@/assets/products/fitness-dry-fit.png";
import jalecoAventalImg from "@/assets/products/jaleco-avental.png";
import coposGarrafasImg from "@/assets/products/copos-garrafas.png";
import almofadasBonesImg from "@/assets/products/almofadas-bones.png";
import calcasBermudasImg from "@/assets/products/calcas-bermudas.png";

export const PRODUCT_IMAGES: Record<string, string> = {
  "t-shirt": tshirtImg,
  "camisa-polo": camisaPoloImg,
  "camisa-social": camisaSocialImg,
  "moletom-careca": moletomCarecaImg,
  "moletom-ziper": moletomZiperImg,
  "moletom-canguru": moletomCanguruImg,
  "ecobag": ecobagImg,
  "sacochila": sacochilaImg,
  "fitness-dry-fit": fitnessDryFitImg,
  "jaleco-avental": jalecoAventalImg,
  "copos-garrafas": coposGarrafasImg,
  "almofadas-bones": almofadasBonesImg,
  "calcas-bermudas": calcasBermudasImg,
};

export function getProductImage(categoryId: string): string {
  return PRODUCT_IMAGES[categoryId] || "/placeholder.svg";
}
