package net.estg.ei.backend.ws;

import net.estg.ei.backend.adapters.AbstractAdapter;
import net.estg.ei.backend.entity.AbstractEntity;
import net.estg.ei.backend.service.IAbstractService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

public abstract class AbstractRESTImpl<T extends AbstractEntity, E> {

  protected AbstractAdapter<T,E> adapter;
  protected IAbstractService<T> service;

  public AbstractRESTImpl(IAbstractService<T> service) {
    this.service = service;
    this.adapter = getAdapter();
  }
  protected abstract AbstractAdapter<T, E> getAdapter();

  @GetMapping("/{id}")
  public ResponseEntity<E> get(@PathVariable long id) {
    T entity = service.findById(id);
    E dto = adapter.entityToDTO(entity);
    return ResponseEntity.ok(dto);
  }

  @GetMapping
  public ResponseEntity<List<E>> getAll() {
    List<T> entities = service.findAll();
    List<E> dtos = entities.stream().map(adapter::entityToDTO).collect(Collectors.toList());
    return ResponseEntity.ok(dtos);
  }

  @PostMapping
  public ResponseEntity<E> create(@RequestBody E dto) {
    T entity = adapter.dtoToEntity(dto);
    T savedEntity = service.save(entity);
    E savedDto = adapter.entityToDTO(savedEntity);
    return ResponseEntity.ok(savedDto);
  }

  @PutMapping("/{id}")
  public ResponseEntity<E> update(@PathVariable long id, @RequestBody E dto) {
    T entity = adapter.dtoToEntity(dto);
    entity.setId(id);
    T updatedEntity = service.update(entity);
    E updatedDto = adapter.entityToDTO(updatedEntity);
    return ResponseEntity.ok(updatedDto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable int id) {
    T entity = service.findById(id);
    service.delete(entity);
    return ResponseEntity.ok().build();
  }
}
