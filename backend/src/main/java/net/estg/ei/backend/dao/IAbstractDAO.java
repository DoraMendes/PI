package net.estg.ei.backend.dao;

import java.util.List;

public interface IAbstractDAO<T>
{
  T findById(long id);
  List<T> findAll();
  T save(T obj);
  T update(T obj);
  void delete(T obj);
}
