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

  public T findById(int id) {
    return entityManager.find(clazz, id);
  }

  public List<T> findAll() {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<T> cq = cb.createQuery(clazz);
    Root<T> rootEntry = cq.from(clazz);
    CriteriaQuery<T> all = cq.select(rootEntry);
    return entityManager.createQuery(all).getResultList();
  }

  public T save(T prediction) {
    entityManager.persist(prediction);
    return prediction;
  }

  public T update(T prediction) {
    return entityManager.merge(prediction);
  }

  public void delete(T prediction) {
    if (entityManager.contains(prediction)) {
      entityManager.remove(prediction);
    } else {
      entityManager.remove(entityManager.merge(prediction));
    }
  }
}
