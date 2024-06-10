package net.estg.ei.backend.service;

import java.util.List;

public interface IAbstractService<T>
{
  T findById(long id);
  List<T> findAll();
  T save(T obj);
  T update(T obj);
  void delete(T obj);
}
