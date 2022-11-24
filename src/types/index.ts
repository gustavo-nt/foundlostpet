export enum SituationEnum {
  MISSING = "Desaparecido",
  SIGHNED = "Avistado",
  FOUND = "Encontrado",
}

export enum LinkEnum {
  dog = "https://thumbs.dreamstime.com/b/ilustra%C3%A7%C3%A3o-de-arte-digital-c%C3%A3es-kooikerhondje-kooiker-isolada-em-fundo-branco-pa%C3%ADs-origem-c%C3%A3o-metralhador-desportivo-animal-258947809.jpg",
  bird = "https://thumbs.dreamstime.com/b/ilustra%C3%A7%C3%A3o-da-arte-digital-de-weigela-isolada-em-branco-arbusto-flor-m%C3%A3o-fam%C3%ADlia-das-caprifoli%C3%A1ceas-bot%C3%A2nico-colorido-194978622.jpg",
  cat = "https://thumbs.dreamstime.com/b/forest-cat-norsk-skogkatt-ou-skaukatt-ra%C3%A7a-dom%C3%A9stica-ilustra%C3%A7%C3%A3o-de-arte-digital-gatinho-desenhado-%C3%A0-m%C3%A3o-para-web-kitten-168891503.jpg",
  horse = "https://thumbs.dreamstime.com/b/ilustra%C3%A7%C3%A3o-de-arte-digital-unic%C3%B3rn-isolada-em-fundo-branco-legend%C3%A1ria-e-antiga-criatura-mitol%C3%B3gica-sonho-conto-fadas-desenho-159544715.jpg",
  rodent = "https://thumbs.dreamstime.com/b/chinchilla-isolada-na-ilustra%C3%A7%C3%A3o-de-arte-digital-fundo-branca-ratinho-pelado-ou-rato-peludo-zod%C3%ADaco-estima%C3%A7%C3%A3o-chinesa-232825323.jpg",
  cow = "https://thumbs.dreamstime.com/b/cabe%C3%A7a-de-vaca-isolada-na-ilustra%C3%A7%C3%A3o-fundo-branco-da-arte-digital-animais-jovens-dom%C3%A9sticos-castanhos-que-trazem-vertebrados-232825331.jpg",
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  created_at: string;
  password: string;
}

export interface DisappearanceProps {
  id: string;
  name: string;
  type: keyof typeof LinkEnum;
  situation: keyof typeof SituationEnum;
  updated_at: string;
  created_at: string;
  user: UserProps;
  latitude: string;
  longitude: string;
  description: string;
  image: string;
  city: string;
  uf: string;
}
