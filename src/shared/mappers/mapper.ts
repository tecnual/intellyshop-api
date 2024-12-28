export abstract class Mapper<From, To> {
  // Convierte una entidad del dominio a un DTO
  abstract mapFrom(entity: From): To;

  // Convierte un DTO a una entidad del dominio
  abstract mapTo(dto: To): From;
}
