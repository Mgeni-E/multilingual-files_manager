const i18n = require("i18next");
const Backend = require("i18next-http-middleware");
const path = require("path");
const { fileURLToPath } = require("url");

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import translation files directly
const enTranslations = {
  translation: {
    welcome: "Welcome to the Multilingual File Manager",
    serverError: "Internal Server Error",
  },
};

const esTranslations = {
  translation: {
    welcome: "Bienvenido al Administrador de Archivos Multilingüe",
    serverError: "Error Interno del Servidor",
  },
};

i18n.use(Backend).init({
  lng: "en", // default language
  fallbackLng: "en",
  resources: {
    en: enTranslations,
    es: esTranslations,
  },
  interpolation: {
    escapeValue: false,
  },
});

const i18nMiddleware = (req, res, next) => {
  // Detect language from query parameter or Accept-Language header
  const lang =
    req.query.lang || req.headers["accept-language"]?.split(",")[0] || "en";

  // Validate and set language
  if (["en", "es"].includes(lang)) {
    req.i18n.changeLanguage(lang);
  }

  // Attach translation function to request
  req.t = req.i18n.t;
  next();
};

module.exports = i18nMiddleware;
