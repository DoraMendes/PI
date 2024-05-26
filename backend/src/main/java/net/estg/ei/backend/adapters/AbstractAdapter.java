package net.estg.ei.backend.adapters;


public interface AbstractAdapter<T,E>
{
  E entityToDTO(T entity);
  T dtoToEntity(E dto);
}
