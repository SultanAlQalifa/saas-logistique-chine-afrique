export interface Currency {
  code: string
  name: string
  symbol: string
  country?: string
}

export const currencies: Currency[] = [
  // Major World Currencies
  { code: 'USD', name: 'Dollar américain', symbol: '$', country: 'États-Unis' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'Zone Euro' },
  { code: 'GBP', name: 'Livre sterling', symbol: '£', country: 'Royaume-Uni' },
  { code: 'JPY', name: 'Yen japonais', symbol: '¥', country: 'Japon' },
  { code: 'CHF', name: 'Franc suisse', symbol: 'CHF', country: 'Suisse' },
  { code: 'CAD', name: 'Dollar canadien', symbol: 'C$', country: 'Canada' },
  { code: 'AUD', name: 'Dollar australien', symbol: 'A$', country: 'Australie' },
  { code: 'CNY', name: 'Yuan chinois', symbol: '¥', country: 'Chine' },

  // African Currencies (CFA and others)
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', country: 'Afrique de l\'Ouest' },
  { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', country: 'Afrique Centrale' },
  { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R', country: 'Afrique du Sud' },
  { code: 'NGN', name: 'Naira nigérian', symbol: '₦', country: 'Nigéria' },
  { code: 'GHS', name: 'Cedi ghanéen', symbol: '₵', country: 'Ghana' },
  { code: 'KES', name: 'Shilling kényan', symbol: 'KSh', country: 'Kenya' },
  { code: 'UGX', name: 'Shilling ougandais', symbol: 'USh', country: 'Ouganda' },
  { code: 'TZS', name: 'Shilling tanzanien', symbol: 'TSh', country: 'Tanzanie' },
  { code: 'ETB', name: 'Birr éthiopien', symbol: 'Br', country: 'Éthiopie' },
  { code: 'EGP', name: 'Livre égyptienne', symbol: '£', country: 'Égypte' },
  { code: 'MAD', name: 'Dirham marocain', symbol: 'DH', country: 'Maroc' },
  { code: 'TND', name: 'Dinar tunisien', symbol: 'د.ت', country: 'Tunisie' },
  { code: 'DZD', name: 'Dinar algérien', symbol: 'د.ج', country: 'Algérie' },
  { code: 'LYD', name: 'Dinar libyen', symbol: 'ل.د', country: 'Libye' },
  { code: 'SDG', name: 'Livre soudanaise', symbol: 'ج.س.', country: 'Soudan' },
  { code: 'MUR', name: 'Roupie mauricienne', symbol: '₨', country: 'Maurice' },
  { code: 'SCR', name: 'Roupie seychelloise', symbol: '₨', country: 'Seychelles' },
  { code: 'MGA', name: 'Ariary malgache', symbol: 'Ar', country: 'Madagascar' },
  { code: 'MWK', name: 'Kwacha malawien', symbol: 'MK', country: 'Malawi' },
  { code: 'ZMW', name: 'Kwacha zambien', symbol: 'ZK', country: 'Zambie' },
  { code: 'BWP', name: 'Pula botswanais', symbol: 'P', country: 'Botswana' },
  { code: 'SZL', name: 'Lilangeni swazi', symbol: 'L', country: 'Eswatini' },
  { code: 'LSL', name: 'Loti lesothan', symbol: 'L', country: 'Lesotho' },
  { code: 'NAD', name: 'Dollar namibien', symbol: 'N$', country: 'Namibie' },
  { code: 'AOA', name: 'Kwanza angolais', symbol: 'Kz', country: 'Angola' },
  { code: 'MZN', name: 'Metical mozambicain', symbol: 'MT', country: 'Mozambique' },
  { code: 'CVE', name: 'Escudo cap-verdien', symbol: '$', country: 'Cap-Vert' },
  { code: 'STN', name: 'Dobra santoméen', symbol: 'Db', country: 'Sao Tomé-et-Principe' },
  { code: 'GMD', name: 'Dalasi gambien', symbol: 'D', country: 'Gambie' },
  { code: 'GNF', name: 'Franc guinéen', symbol: 'FG', country: 'Guinée' },
  { code: 'LRD', name: 'Dollar libérien', symbol: 'L$', country: 'Libéria' },
  { code: 'SLL', name: 'Leone sierra-léonais', symbol: 'Le', country: 'Sierra Leone' },
  { code: 'RWF', name: 'Franc rwandais', symbol: 'RF', country: 'Rwanda' },
  { code: 'BIF', name: 'Franc burundais', symbol: 'FBu', country: 'Burundi' },
  { code: 'DJF', name: 'Franc djiboutien', symbol: 'Fdj', country: 'Djibouti' },
  { code: 'ERN', name: 'Nakfa érythréen', symbol: 'Nfk', country: 'Érythrée' },
  { code: 'SOS', name: 'Shilling somalien', symbol: 'Sh', country: 'Somalie' },
  { code: 'SSP', name: 'Livre sud-soudanaise', symbol: '£', country: 'Soudan du Sud' },
  { code: 'CDF', name: 'Franc congolais', symbol: 'FC', country: 'RD Congo' },
  { code: 'KMF', name: 'Franc comorien', symbol: 'CF', country: 'Comores' },
  { code: 'MRU', name: 'Ouguiya mauritanien', symbol: 'UM', country: 'Mauritanie' },
  { code: 'ZWL', name: 'Dollar zimbabwéen', symbol: 'Z$', country: 'Zimbabwe' },

  // Asian Currencies
  { code: 'INR', name: 'Roupie indienne', symbol: '₹', country: 'Inde' },
  { code: 'KRW', name: 'Won sud-coréen', symbol: '₩', country: 'Corée du Sud' },
  { code: 'SGD', name: 'Dollar singapourien', symbol: 'S$', country: 'Singapour' },
  { code: 'HKD', name: 'Dollar de Hong Kong', symbol: 'HK$', country: 'Hong Kong' },
  { code: 'THB', name: 'Baht thaïlandais', symbol: '฿', country: 'Thaïlande' },
  { code: 'MYR', name: 'Ringgit malaisien', symbol: 'RM', country: 'Malaisie' },
  { code: 'IDR', name: 'Roupie indonésienne', symbol: 'Rp', country: 'Indonésie' },
  { code: 'PHP', name: 'Peso philippin', symbol: '₱', country: 'Philippines' },
  { code: 'VND', name: 'Dong vietnamien', symbol: '₫', country: 'Vietnam' },
  { code: 'TWD', name: 'Dollar taïwanais', symbol: 'NT$', country: 'Taïwan' },
  { code: 'PKR', name: 'Roupie pakistanaise', symbol: '₨', country: 'Pakistan' },
  { code: 'BDT', name: 'Taka bangladais', symbol: '৳', country: 'Bangladesh' },
  { code: 'LKR', name: 'Roupie sri-lankaise', symbol: '₨', country: 'Sri Lanka' },
  { code: 'NPR', name: 'Roupie népalaise', symbol: '₨', country: 'Népal' },
  { code: 'AFN', name: 'Afghani afghan', symbol: '؋', country: 'Afghanistan' },
  { code: 'BND', name: 'Dollar brunéien', symbol: 'B$', country: 'Brunei' },
  { code: 'KHR', name: 'Riel cambodgien', symbol: '៛', country: 'Cambodge' },
  { code: 'LAK', name: 'Kip laotien', symbol: '₭', country: 'Laos' },
  { code: 'MMK', name: 'Kyat birman', symbol: 'K', country: 'Myanmar' },
  { code: 'MNT', name: 'Tugrik mongol', symbol: '₮', country: 'Mongolie' },
  { code: 'KZT', name: 'Tenge kazakh', symbol: '₸', country: 'Kazakhstan' },
  { code: 'UZS', name: 'Sum ouzbek', symbol: 'лв', country: 'Ouzbékistan' },
  { code: 'KGS', name: 'Som kirghize', symbol: 'лв', country: 'Kirghizistan' },
  { code: 'TJS', name: 'Somoni tadjik', symbol: 'SM', country: 'Tadjikistan' },
  { code: 'TMT', name: 'Manat turkmène', symbol: 'T', country: 'Turkménistan' },

  // Middle Eastern Currencies
  { code: 'AED', name: 'Dirham des EAU', symbol: 'د.إ', country: 'Émirats Arabes Unis' },
  { code: 'SAR', name: 'Riyal saoudien', symbol: '﷼', country: 'Arabie Saoudite' },
  { code: 'QAR', name: 'Riyal qatarien', symbol: '﷼', country: 'Qatar' },
  { code: 'KWD', name: 'Dinar koweïtien', symbol: 'د.ك', country: 'Koweït' },
  { code: 'BHD', name: 'Dinar bahreïni', symbol: '.د.ب', country: 'Bahreïn' },
  { code: 'OMR', name: 'Rial omanais', symbol: '﷼', country: 'Oman' },
  { code: 'JOD', name: 'Dinar jordanien', symbol: 'د.ا', country: 'Jordanie' },
  { code: 'LBP', name: 'Livre libanaise', symbol: '£', country: 'Liban' },
  { code: 'SYP', name: 'Livre syrienne', symbol: '£', country: 'Syrie' },
  { code: 'IQD', name: 'Dinar irakien', symbol: 'ع.د', country: 'Irak' },
  { code: 'IRR', name: 'Rial iranien', symbol: '﷼', country: 'Iran' },
  { code: 'TRY', name: 'Livre turque', symbol: '₺', country: 'Turquie' },
  { code: 'ILS', name: 'Shekel israélien', symbol: '₪', country: 'Israël' },

  // European Currencies (non-Euro)
  { code: 'RUB', name: 'Rouble russe', symbol: '₽', country: 'Russie' },
  { code: 'UAH', name: 'Hryvnia ukrainienne', symbol: '₴', country: 'Ukraine' },
  { code: 'BYN', name: 'Rouble biélorusse', symbol: 'Br', country: 'Biélorussie' },
  { code: 'PLN', name: 'Złoty polonais', symbol: 'zł', country: 'Pologne' },
  { code: 'CZK', name: 'Couronne tchèque', symbol: 'Kč', country: 'République tchèque' },
  { code: 'HUF', name: 'Forint hongrois', symbol: 'Ft', country: 'Hongrie' },
  { code: 'RON', name: 'Leu roumain', symbol: 'lei', country: 'Roumanie' },
  { code: 'BGN', name: 'Lev bulgare', symbol: 'лв', country: 'Bulgarie' },
  { code: 'HRK', name: 'Kuna croate', symbol: 'kn', country: 'Croatie' },
  { code: 'RSD', name: 'Dinar serbe', symbol: 'Дин.', country: 'Serbie' },
  { code: 'BAM', name: 'Mark convertible', symbol: 'KM', country: 'Bosnie-Herzégovine' },
  { code: 'MKD', name: 'Denar macédonien', symbol: 'ден', country: 'Macédoine du Nord' },
  { code: 'ALL', name: 'Lek albanais', symbol: 'L', country: 'Albanie' },
  { code: 'MDL', name: 'Leu moldave', symbol: 'L', country: 'Moldavie' },
  { code: 'GEL', name: 'Lari géorgien', symbol: '₾', country: 'Géorgie' },
  { code: 'AMD', name: 'Dram arménien', symbol: '֏', country: 'Arménie' },
  { code: 'AZN', name: 'Manat azerbaïdjanais', symbol: '₼', country: 'Azerbaïdjan' },
  { code: 'NOK', name: 'Couronne norvégienne', symbol: 'kr', country: 'Norvège' },
  { code: 'SEK', name: 'Couronne suédoise', symbol: 'kr', country: 'Suède' },
  { code: 'DKK', name: 'Couronne danoise', symbol: 'kr', country: 'Danemark' },
  { code: 'ISK', name: 'Couronne islandaise', symbol: 'kr', country: 'Islande' },

  // American Currencies
  { code: 'MXN', name: 'Peso mexicain', symbol: '$', country: 'Mexique' },
  { code: 'BRL', name: 'Réal brésilien', symbol: 'R$', country: 'Brésil' },
  { code: 'ARS', name: 'Peso argentin', symbol: '$', country: 'Argentine' },
  { code: 'CLP', name: 'Peso chilien', symbol: '$', country: 'Chili' },
  { code: 'COP', name: 'Peso colombien', symbol: '$', country: 'Colombie' },
  { code: 'PEN', name: 'Sol péruvien', symbol: 'S/', country: 'Pérou' },
  { code: 'UYU', name: 'Peso uruguayen', symbol: '$U', country: 'Uruguay' },
  { code: 'PYG', name: 'Guaraní paraguayen', symbol: 'Gs', country: 'Paraguay' },
  { code: 'BOB', name: 'Boliviano bolivien', symbol: '$b', country: 'Bolivie' },
  { code: 'VES', name: 'Bolívar vénézuélien', symbol: 'Bs', country: 'Venezuela' },
  { code: 'GYD', name: 'Dollar guyanien', symbol: 'G$', country: 'Guyana' },
  { code: 'SRD', name: 'Dollar surinamien', symbol: '$', country: 'Suriname' },
  { code: 'ECU', name: 'Dollar équatorien', symbol: '$', country: 'Équateur' },
  { code: 'GTQ', name: 'Quetzal guatémaltèque', symbol: 'Q', country: 'Guatemala' },
  { code: 'HNL', name: 'Lempira hondurien', symbol: 'L', country: 'Honduras' },
  { code: 'NIO', name: 'Córdoba nicaraguayen', symbol: 'C$', country: 'Nicaragua' },
  { code: 'CRC', name: 'Colón costaricien', symbol: '₡', country: 'Costa Rica' },
  { code: 'PAB', name: 'Balboa panaméen', symbol: 'B/.', country: 'Panama' },
  { code: 'DOP', name: 'Peso dominicain', symbol: 'RD$', country: 'République dominicaine' },
  { code: 'HTG', name: 'Gourde haïtienne', symbol: 'G', country: 'Haïti' },
  { code: 'JMD', name: 'Dollar jamaïcain', symbol: 'J$', country: 'Jamaïque' },
  { code: 'CUP', name: 'Peso cubain', symbol: '₱', country: 'Cuba' },
  { code: 'BSD', name: 'Dollar bahaméen', symbol: '$', country: 'Bahamas' },
  { code: 'BBD', name: 'Dollar barbadien', symbol: '$', country: 'Barbade' },
  { code: 'TTD', name: 'Dollar trinidadien', symbol: 'TT$', country: 'Trinité-et-Tobago' },

  // Oceania Currencies
  { code: 'NZD', name: 'Dollar néo-zélandais', symbol: 'NZ$', country: 'Nouvelle-Zélande' },
  { code: 'FJD', name: 'Dollar fidjien', symbol: 'FJ$', country: 'Fidji' },
  { code: 'PGK', name: 'Kina papou', symbol: 'K', country: 'Papouasie-Nouvelle-Guinée' },
  { code: 'SBD', name: 'Dollar des Îles Salomon', symbol: 'SI$', country: 'Îles Salomon' },
  { code: 'VUV', name: 'Vatu vanuatuan', symbol: 'VT', country: 'Vanuatu' },
  { code: 'WST', name: 'Tala samoan', symbol: 'WS$', country: 'Samoa' },
  { code: 'TOP', name: 'Pa\'anga tongien', symbol: 'T$', country: 'Tonga' },

  // Special and Regional Currencies
  { code: 'XDR', name: 'Droits de tirage spéciaux', symbol: 'DTS', country: 'FMI' },
  { code: 'XAU', name: 'Once d\'or', symbol: 'oz', country: 'Métal précieux' },
  { code: 'XAG', name: 'Once d\'argent', symbol: 'oz', country: 'Métal précieux' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', country: 'Cryptomonnaie' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', country: 'Cryptomonnaie' },
]

export const getCurrencyByCode = (code: string) => {
  return currencies.find(currency => currency.code === code)
}

export const searchCurrencies = (query: string) => {
  return currencies.filter(currency => 
    currency.name.toLowerCase().includes(query.toLowerCase()) ||
    currency.code.toLowerCase().includes(query.toLowerCase()) ||
    currency.country?.toLowerCase().includes(query.toLowerCase())
  )
}

export const getCurrenciesByRegion = (region: string) => {
  const regionMap: { [key: string]: string[] } = {
    'africa': ['XOF', 'XAF', 'ZAR', 'NGN', 'GHS', 'KES', 'UGX', 'TZS', 'ETB', 'EGP', 'MAD', 'TND', 'DZD', 'LYD'],
    'europe': ['EUR', 'GBP', 'CHF', 'RUB', 'UAH', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'NOK', 'SEK', 'DKK'],
    'asia': ['CNY', 'JPY', 'INR', 'KRW', 'SGD', 'HKD', 'THB', 'MYR', 'IDR', 'PHP', 'VND'],
    'americas': ['USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN'],
    'middle_east': ['AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'TRY', 'ILS'],
    'oceania': ['AUD', 'NZD', 'FJD', 'PGK']
  }
  
  const codes = regionMap[region.toLowerCase()] || []
  return currencies.filter(currency => codes.includes(currency.code))
}
