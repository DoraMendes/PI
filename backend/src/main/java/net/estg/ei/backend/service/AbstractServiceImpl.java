package net.estg.ei.backend.service;

import jakarta.transaction.Transactional;
import net.estg.ei.backend.dao.AbstractDAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public abstract class AbstractServiceImpl<T> implements IAbstractService<T>
{
  @Autowired
  AbstractDAOImpl<T> dao;

  public T findById(long id) {return dao.findById(id);}
  public List<T> findAll() {return dao.findAll();}
  @Transactional
  public T save(T obj) {return dao.save(obj);}
  @Transactional
  public T update(T obj) {return dao.update(obj);}
  @Transactional
  public void delete(T obj) {dao.delete(obj);}
}
