// Lowercase Spanish word → translations in the supported target languages.
// TappableWord looks up the current target language in the AppContext and
// renders the matching translation in the tooltip.

export const glossary = {
  empresa:        { en: 'company',         de: 'Unternehmen',    fr: 'entreprise',    it: 'azienda',         ja: '会社' },
  batería:        { en: 'battery',         de: 'Batterie',       fr: 'batterie',      it: 'batteria',        ja: 'バッテリー' },
  fabricantes:    { en: 'manufacturers',   de: 'Hersteller',     fr: 'fabricants',    it: 'produttori',      ja: 'メーカー' },
  obstáculo:      { en: 'obstacle',        de: 'Hindernis',      fr: 'obstacle',      it: 'ostacolo',        ja: '障害' },
  escollos:       { en: 'obstacles',       de: 'Hürden',         fr: 'écueils',       it: 'scogli',          ja: '難関' },
  hallazgo:       { en: 'discovery',       de: 'Fund',           fr: 'découverte',    it: 'scoperta',        ja: '発見' },
  vivienda:       { en: 'housing',         de: 'Wohnen',         fr: 'logement',      it: 'abitazione',      ja: '住宅' },
  mosaico:        { en: 'mosaic',          de: 'Mosaik',         fr: 'mosaïque',      it: 'mosaico',         ja: 'モザイク' },
  estadio:        { en: 'stadium',         de: 'Stadion',        fr: 'stade',         it: 'stadio',          ja: 'スタジアム' },
  tren:           { en: 'train',           de: 'Zug',            fr: 'train',         it: 'treno',           ja: '列車' },
  fiesta:         { en: 'festival',        de: 'Fest',           fr: 'fête',          it: 'festa',           ja: '祭り' },
  investigadores: { en: 'researchers',     de: 'Forscher',       fr: 'chercheurs',    it: 'ricercatori',     ja: '研究者' },
  inteligencia:   { en: 'intelligence',    de: 'Intelligenz',    fr: 'intelligence',  it: 'intelligenza',    ja: '知能' },
  océanos:        { en: 'oceans',          de: 'Ozeane',         fr: 'océans',        it: 'oceani',          ja: '海洋' },
  plástico:       { en: 'plastic',         de: 'Plastik',        fr: 'plastique',     it: 'plastica',        ja: 'プラスチック' },
  fresco:         { en: 'fresco',          de: 'Fresko',         fr: 'fresque',       it: 'affresco',        ja: 'フレスコ画' },
  metro:          { en: 'subway',          de: 'U-Bahn',         fr: 'métro',         it: 'metropolitana',   ja: '地下鉄' },
}

export function getTranslation(spanish, lang) {
  if (!spanish) return ''
  const key = spanish.toLowerCase().trim()
  return glossary[key]?.[lang] || ''
}
