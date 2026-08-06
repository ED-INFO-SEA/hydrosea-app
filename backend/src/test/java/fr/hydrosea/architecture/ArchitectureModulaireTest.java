package fr.hydrosea.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchitectureModulaireTest {
  private final com.tngtech.archunit.core.domain.JavaClasses classes=new ClassFileImporter()
      .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS).importPackages("fr.hydrosea");
  @Test void domaine_independant_des_cadres_techniques() {
    noClasses().that().resideInAPackage("..domaine..").should().dependOnClassesThat()
        .resideInAnyPackage("org.springframework..","jakarta.persistence..","io.minio..").check(classes);
  }
  @Test void controleurs_sans_acces_aux_adaptateurs() {
    noClasses().that().resideInAPackage("..interfaceapi..").should().dependOnClassesThat()
        .resideInAnyPackage("..infrastructure..").check(classes);
  }
  @Test void application_independante_des_dto_http() {
    noClasses().that().resideInAPackage("..application..").should().dependOnClassesThat()
        .resideInAnyPackage("..interfaceapi..").check(classes);
  }
  @Test void domaine_independant_des_couches_exterieures() {
    noClasses().that().resideInAPackage("..domaine..").should().dependOnClassesThat()
        .resideInAnyPackage("..application..","..interfaceapi..","..infrastructure..").check(classes);
  }
  @Test void adaptateurs_dans_infrastructure() {
    classes().that().haveSimpleNameStartingWith("Adaptateur").should().resideInAPackage("..infrastructure..").check(classes);
  }
}
