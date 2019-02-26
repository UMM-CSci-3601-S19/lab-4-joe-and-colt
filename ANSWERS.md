## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. The UserContoller constructor takes in a mongo database and stores a collection of documents that are in the "user" collection in the 
database. In Server the mongoClient is initialized, and the database is retrieved by .getDatabase(userDatabase). After that,
the request handler sets up the usercontroller that manages requests for info about users. 
1. We pass getUser a string representing an id. and jsonUsers is set to an iterable that contains documents from the database
 where the given id is the same. It then goes through the iterable and returns a document from it if one exists.
1. filterDoc is a document that specifies which documents we want to retrieve from the database. To filter by age we add a key value pair to 
filterDoc with the key "age" and the age we wish to find.
1. The document objects are representing json objects and are used so that java is able to handle the json objects returned from the database easily.
1. It clears the user colection in the test database and reinintiallizes it so that each test starts with the same user documents in the database.
1. It checks that there are two users who are 37 and that their names are what we expect. It gets an array of documents from the user collection in the test database that
have age 37. It then checks that this array is of length 2 and that when it sorts their names we get {"Jamie", "Pat"}.
1. UserRequestHandler is called on a post request and retrieves information from the request inorder to call userController.
UserController then creates a document with the given info which is added to the database.
