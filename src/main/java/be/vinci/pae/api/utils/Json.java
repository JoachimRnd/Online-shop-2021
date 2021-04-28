package be.vinci.pae.api.utils;

import java.util.List;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import views.Views;

public class Json {

  private static final ObjectMapper jsonMapper = new ObjectMapper();

  /**
   * Filter whole custom JSON object as a list.
   *
   * @param <T> generic return type
   * @param list list of generic objects
   * @param targetClass name of the targeted class
   * @return a list of objects (with generic type)
   */
  public static <T> List<T> filterPublicJsonViewAsList(List<T> list, Class<T> targetClass) {

    try {
      JavaType type = jsonMapper.getTypeFactory().constructCollectionType(List.class, targetClass);
      // serialize using JSON Views : public view (all fields not required in the
      // views are set to null)
      String publicItemListAsString =
          jsonMapper.writerWithView(Views.Public.class).writeValueAsString(list);
      // deserialize using JSON Views : Public View
      return jsonMapper.readerWithView(Views.Public.class).forType(type)
          .readValue(publicItemListAsString);

    } catch (JsonProcessingException e) {

      e.printStackTrace();
      return null;
    }

  }

  /**
   * Filter whole custom JSON object.
   *
   * @param <T> generic return type
   * @param item description
   * @param targetClass name of the targeted class
   * @return a generic object
   */
  public static <T> T filterPublicJsonView(T item, Class<T> targetClass) {

    try {
      // serialize using JSON Views : public view (all fields not required in the
      // views are set to null)
      String publicItemAsString =
          jsonMapper.writerWithView(Views.Public.class).writeValueAsString(item);
      // deserialize using JSON Views : Public View
      return jsonMapper.readerWithView(Views.Public.class).forType(targetClass)
          .readValue(publicItemAsString);

    } catch (JsonProcessingException e) {

      e.printStackTrace();
      return null;
    }

  }

}
