package net.estg.ei.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloRestImpl
{
  @GetMapping("/")
  public String index() {
    return "Home";
  }
}
