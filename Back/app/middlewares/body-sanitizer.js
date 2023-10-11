// Importation du module 'sanitizer' qui sera utilisé pour échapper les données du corps de la requête
const sanitizer = require("sanitizer");

// Middleware de sanitation (échappement) pour le corps de la requête
const bodySanitizer = (req, res, next) => {
  if (req.body) {
    // Parcourt toutes les propriétés du corps de la requête
    for (let propName in req.body) {
      // Échappe (sanitizes) la valeur de chaque propriété du corps de la requête
      req.body[propName] = sanitizer.escape(req.body[propName]);
    }
  }
  // Passe au middleware suivant dans la chaîne de traitement des requêtes
  next();
};

// Exporte le middleware 'bodySanitizer' pour qu'il puisse être utilisé ailleurs
module.exports = bodySanitizer;
