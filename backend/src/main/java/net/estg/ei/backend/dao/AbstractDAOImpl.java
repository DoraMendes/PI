package net.estg.ei.backend.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public abstract class AbstractDAOImpl<T> implements IAbstractDAO<T>
{
  private final Class<T> clazz;

  protected AbstractDAOImpl(Class<T> clazz) {
    this.clazz = clazz;
  }

  @PersistenceContext
  private EntityManager entityManager;

  public T findById(long id) {
    return entityManager.find(clazz, id);
  }

  public List<T> findAll() {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<T> cq = cb.createQuery(clazz);
    Root<T> rootEntry = cq.from(clazz);
    CriteriaQuery<T> all = cq.select(rootEntry);
    return entityManager.createQuery(all).getResultList();
  }

  public T save(T entity) {
    entityManager.persist(entity);
    return entity;
  }

  public T update(T entity) {
    return entityManager.merge(entity);
  }

  public void delete(T entity) {
    if (entityManager.contains(entity)) {
      entityManager.remove(entity);
    } else {
      entityManager.remove(entityManager.merge(entity));
    }
  }
}
