package umm3601.todo;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

  private final MongoCollection<Document> todoCollection;

  /**
   * Construct a controller for todos.
   *
   * @param database the database containing todo data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = database.getCollection("todos");
  }

  /**
   * Helper method that gets a single todo specified by the `id`
   * parameter in the request.
   *
   * @param id the Mongo ID of the desired todo
   * @return the desired todo as a JSON object if the todo with that ID is found,
   * and `null` if no todo with that ID is found
   */
  public String getTodo(String id) {
    FindIterable<Document>
      jsonTodos = todoCollection.find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonTodos.iterator();
    if (iterator.hasNext()) {
      Document todo = iterator.next();
      return todo.toJson();
    } else {
      // We didn't find the desired todo
      return null;
    }
  }

  public String getTodos(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("owner")) {
      String targetOwner = queryParams.get("owner")[0];
      filterDoc = filterDoc.append("owner", targetOwner);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

    return serializeIterable(matchingTodos);
  }

  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }


  public String addNewTodo(String owner, String status, String category, String body) {

    Document newTodo = new Document();
    newTodo.append("owner", owner);
    newTodo.append("status", status);
    newTodo.append("category", category);
    newTodo.append("body", body);

    try {
      todoCollection.insertOne(newTodo);
      ObjectId id = newTodo.getObjectId("_id");
      System.err.println("Successfully added new todo [_id=" + id + ", owner=" + owner + ", status=" + status
        + " category=" + category + " body=" + body + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}
