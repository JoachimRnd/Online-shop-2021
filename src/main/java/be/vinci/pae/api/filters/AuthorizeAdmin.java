package be.vinci.pae.api.filters;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import jakarta.ws.rs.NameBinding;
import java.lang.annotation.Retention;

@NameBinding
@Retention(RUNTIME)
public @interface AuthorizeAdmin {

}
