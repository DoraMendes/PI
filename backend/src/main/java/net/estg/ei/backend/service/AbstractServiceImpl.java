package net.estg.ei.backend.service;

import net.estg.ei.backend.dao.AbstractDAOImpl;
import net.estg.ei.backend.entity.AbstractEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public abstract class AbstractServiceImpl<T extends AbstractEntity> implements IAbstractService<T>
{
  @Autowired
  AbstractDAOImpl<T> dao;

  @Transactional(readOnly = true)
  public T findById(long id) {return dao.findById(id);}
  @Transactional(readOnly = true)
  public List<T> findAll() {return dao.findAll();}
  @Transactional
  public T save(T obj) {return dao.save(obj);}
  @Transactional
  public T update(T obj) {return dao.update(obj);}
  @Transactional
  public void delete(T obj) {dao.delete(obj);}
}
