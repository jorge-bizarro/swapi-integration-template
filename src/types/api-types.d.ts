export interface IBaseSuccessResponse {
  status: string;
  data: string;
}

export interface IBaseFailureResponse {
  status: string;
  error: string;
}

interface IPersonTranslatedResponse {
  color_cabello: string
  color_piel: string
  planeta_origen: string
  talla: string
  peso: string
  peliculas: string[]
  fecha_nacimiento: string
  especies: any[]
  swapi_person_id: string
  naves: string[]
  fecha_creacion: string
  nombre: string
  uuid: string
  vehiculos: string[]
  url: string
  color_ojo: string
  fecha_edicion: string
  genero: string
}

export interface ISuccessGetSwapiPersonResponse {
  status: string;
  data: IPersonTranslatedResponse
}

export interface ISuccessSavePersonResponse {
  status: string;
}
export interface ISuccessGetAllPersonsResponse {
  status: string;
  data: IPersonTranslatedResponse[]
}
