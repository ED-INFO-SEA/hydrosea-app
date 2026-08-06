package fr.hydrosea.evenements.infrastructure;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigurationRabbitMq {
  @Bean
  TopicExchange echangeMetier(@Value("${hydrosea.evenements.echange}") String nom) {
    return new TopicExchange(nom, true, false);
  }
}
