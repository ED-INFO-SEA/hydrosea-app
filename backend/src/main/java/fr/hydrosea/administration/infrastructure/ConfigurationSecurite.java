package fr.hydrosea.administration.infrastructure;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.hydrosea.commun.interfaceapi.ErreurApi;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class ConfigurationSecurite {
  @Bean
  JwtDecoder decodeur(@Value("${hydrosea.securite.jwk-set-uri}") String jwk,
      @Value("${hydrosea.securite.issuer}") String issuer,@Value("${hydrosea.securite.audience}") String audience) {
    NimbusJwtDecoder decodeur=NimbusJwtDecoder.withJwkSetUri(jwk).build();
    OAuth2TokenValidator<Jwt> standard=JwtValidators.createDefaultWithIssuer(issuer);
    OAuth2TokenValidator<Jwt> valideAudience=jeton -> jeton.getAudience().contains(audience)
        ? OAuth2TokenValidatorResult.success()
        : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token","Audience JWT invalide.",null));
    decodeur.setJwtValidator(jeton -> {
      var premier=standard.validate(jeton); return premier.hasErrors()?premier:valideAudience.validate(jeton);
    });
    return decodeur;
  }
  @Bean
  SecurityFilterChain securite(HttpSecurity http,ObjectMapper json) throws Exception {
    return http.csrf(csrf->csrf.disable())
        .authorizeHttpRequests(regles->regles.requestMatchers("/actuator/health").permitAll().anyRequest().authenticated())
        .oauth2ResourceServer(oauth->oauth.jwt(jwt->{})
            .authenticationEntryPoint((requete,reponse,e)->ecrire(json,reponse,401,"API-AUTHENTIFICATION","Authentification requise"))
            .accessDeniedHandler((requete,reponse,e)->ecrire(json,reponse,403,"API-AUTORISATION","Droit insuffisant")))
        .build();
  }
  private static void ecrire(ObjectMapper json,HttpServletResponse reponse,int statut,String code,String titre) throws IOException {
    reponse.setStatus(statut); reponse.setContentType("application/json");
    json.writeValue(reponse.getOutputStream(),ErreurApi.creer(code,titre,titre,statut));
  }
}
