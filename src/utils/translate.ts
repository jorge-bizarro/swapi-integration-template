import i18next from 'i18next';

i18next.init({
  lng: 'en',
  debug: false,
  resources: {
    en: {
      translation: {
        "name": "nombre",
        "height": "talla",
        "mass": "peso",
        "hair_color": "color_cabello",
        "skin_color": "color_piel",
        "eye_color": "color_ojo",
        "birth_year": "fecha_nacimiento",
        "gender": "genero",
        "homeworld": "planeta_origen",
        "films": "peliculas",
        "species": "especies",
        "vehicles": "vehiculos",
        "starships": "naves",
        "created": "fecha_creacion",
        "edited": "fecha_edicion",
        "swapiPersonId": "swapi_person_id"
      }
    }
  }
});

const translateText = (text: string) => i18next.t(text);

export const translateObjectKeys = (object: { [key: string]: any }) => {
  return Object.keys(object).reduce((acc: { [key: string]: any }, key) => {
    acc[translateText(key)] = object[key];
    return acc;
  }, {});
}
