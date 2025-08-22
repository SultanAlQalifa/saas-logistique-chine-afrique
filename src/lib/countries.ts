export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
  currency: string
  continent: string
}

export const countries: Country[] = [
  // Africa
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dialCode: '+213', currency: 'DZD', continent: 'Africa' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244', currency: 'AOA', continent: 'Africa' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', dialCode: '+229', currency: 'XOF', continent: 'Africa' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267', currency: 'BWP', continent: 'Africa' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226', currency: 'XOF', continent: 'Africa' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257', currency: 'BIF', continent: 'Africa' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', dialCode: '+237', currency: 'XAF', continent: 'Africa' },
  { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻', dialCode: '+238', currency: 'CVE', continent: 'Africa' },
  { code: 'CF', name: 'République Centrafricaine', flag: '🇨🇫', dialCode: '+236', currency: 'XAF', continent: 'Africa' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', dialCode: '+235', currency: 'XAF', continent: 'Africa' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲', dialCode: '+269', currency: 'KMF', continent: 'Africa' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242', currency: 'XAF', continent: 'Africa' },
  { code: 'CD', name: 'République Démocratique du Congo', flag: '🇨🇩', dialCode: '+243', currency: 'CDF', continent: 'Africa' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', dialCode: '+225', currency: 'XOF', continent: 'Africa' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253', currency: 'DJF', continent: 'Africa' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', dialCode: '+20', currency: 'EGP', continent: 'Africa' },
  { code: 'GQ', name: 'Guinée Équatoriale', flag: '🇬🇶', dialCode: '+240', currency: 'XAF', continent: 'Africa' },
  { code: 'ER', name: 'Érythrée', flag: '🇪🇷', dialCode: '+291', currency: 'ERN', continent: 'Africa' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', dialCode: '+251', currency: 'ETB', continent: 'Africa' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241', currency: 'XAF', continent: 'Africa' },
  { code: 'GM', name: 'Gambie', flag: '🇬🇲', dialCode: '+220', currency: 'GMD', continent: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', currency: 'GHS', continent: 'Africa' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', dialCode: '+224', currency: 'GNF', continent: 'Africa' },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', dialCode: '+245', currency: 'XOF', continent: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', currency: 'KES', continent: 'Africa' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266', currency: 'LSL', continent: 'Africa' },
  { code: 'LR', name: 'Libéria', flag: '🇱🇷', dialCode: '+231', currency: 'LRD', continent: 'Africa' },
  { code: 'LY', name: 'Libye', flag: '🇱🇾', dialCode: '+218', currency: 'LYD', continent: 'Africa' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261', currency: 'MGA', continent: 'Africa' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265', currency: 'MWK', continent: 'Africa' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223', currency: 'XOF', continent: 'Africa' },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷', dialCode: '+222', currency: 'MRU', continent: 'Africa' },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺', dialCode: '+230', currency: 'MUR', continent: 'Africa' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', dialCode: '+212', currency: 'MAD', continent: 'Africa' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258', currency: 'MZN', continent: 'Africa' },
  { code: 'NA', name: 'Namibie', flag: '🇳🇦', dialCode: '+264', currency: 'NAD', continent: 'Africa' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227', currency: 'XOF', continent: 'Africa' },
  { code: 'NG', name: 'Nigéria', flag: '🇳🇬', dialCode: '+234', currency: 'NGN', continent: 'Africa' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250', currency: 'RWF', continent: 'Africa' },
  { code: 'ST', name: 'Sao Tomé-et-Principe', flag: '🇸🇹', dialCode: '+239', currency: 'STN', continent: 'Africa' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', dialCode: '+221', currency: 'XOF', continent: 'Africa' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248', currency: 'SCR', continent: 'Africa' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232', currency: 'SLL', continent: 'Africa' },
  { code: 'SO', name: 'Somalie', flag: '🇸🇴', dialCode: '+252', currency: 'SOS', continent: 'Africa' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', dialCode: '+27', currency: 'ZAR', continent: 'Africa' },
  { code: 'SS', name: 'Soudan du Sud', flag: '🇸🇸', dialCode: '+211', currency: 'SSP', continent: 'Africa' },
  { code: 'SD', name: 'Soudan', flag: '🇸🇩', dialCode: '+249', currency: 'SDG', continent: 'Africa' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', dialCode: '+268', currency: 'SZL', continent: 'Africa' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', dialCode: '+255', currency: 'TZS', continent: 'Africa' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228', currency: 'XOF', continent: 'Africa' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dialCode: '+216', currency: 'TND', continent: 'Africa' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', dialCode: '+256', currency: 'UGX', continent: 'Africa' },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲', dialCode: '+260', currency: 'ZMW', continent: 'Africa' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', currency: 'ZWL', continent: 'Africa' },

  // Asia
  { code: 'CN', name: 'Chine', flag: '🇨🇳', dialCode: '+86', currency: 'CNY', continent: 'Asia' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', dialCode: '+91', currency: 'INR', continent: 'Asia' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', dialCode: '+81', currency: 'JPY', continent: 'Asia' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', dialCode: '+82', currency: 'KRW', continent: 'Asia' },
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭', dialCode: '+66', currency: 'THB', continent: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', currency: 'VND', continent: 'Asia' },
  { code: 'SG', name: 'Singapour', flag: '🇸🇬', dialCode: '+65', currency: 'SGD', continent: 'Asia' },
  { code: 'MY', name: 'Malaisie', flag: '🇲🇾', dialCode: '+60', currency: 'MYR', continent: 'Asia' },
  { code: 'ID', name: 'Indonésie', flag: '🇮🇩', dialCode: '+62', currency: 'IDR', continent: 'Asia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', currency: 'PHP', continent: 'Asia' },

  // Europe
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', currency: 'EUR', continent: 'Europe' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dialCode: '+49', currency: 'EUR', continent: 'Europe' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dialCode: '+39', currency: 'EUR', continent: 'Europe' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', dialCode: '+34', currency: 'EUR', continent: 'Europe' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dialCode: '+44', currency: 'GBP', continent: 'Europe' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', dialCode: '+31', currency: 'EUR', continent: 'Europe' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', dialCode: '+32', currency: 'EUR', continent: 'Europe' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', dialCode: '+41', currency: 'CHF', continent: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', currency: 'EUR', continent: 'Europe' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺', dialCode: '+7', currency: 'RUB', continent: 'Europe' },

  // Americas
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dialCode: '+1', currency: 'USD', continent: 'Americas' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', currency: 'CAD', continent: 'Americas' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', dialCode: '+55', currency: 'BRL', continent: 'Americas' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', dialCode: '+52', currency: 'MXN', continent: 'Americas' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷', dialCode: '+54', currency: 'ARS', continent: 'Americas' },

  // Middle East
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', dialCode: '+971', currency: 'AED', continent: 'Asia' },
  { code: 'SA', name: 'Arabie Saoudite', flag: '🇸🇦', dialCode: '+966', currency: 'SAR', continent: 'Asia' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷', dialCode: '+90', currency: 'TRY', continent: 'Asia' },
]

export const getCountriesByContinent = (continent: string) => {
  return countries.filter(country => country.continent === continent)
}

export const getCountryByCode = (code: string) => {
  return countries.find(country => country.code === code)
}

export const searchCountries = (query: string) => {
  return countries.filter(country => 
    country.name.toLowerCase().includes(query.toLowerCase()) ||
    country.code.toLowerCase().includes(query.toLowerCase())
  )
}
