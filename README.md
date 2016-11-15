# tags-system

This document is a draft which contains ideas and first thoughts on how to build a reusable tags-system.

# Tools

- PostgreSQL to store the tags
- Hapi plugin
- [Good parts linter](https://github.com/dwyl/goodparts)

# Testing

We are using Substack's [Tape module](https://github.com/substack/tape) to test our functionality.
- Istanbul, Travis, Codecov are tools we are using
- 100% coverage for statements functions lines branches

# MVP features

Initialise a "tags" table which will contain all the tags. The tags will be added from a json file with the following format:

```
[
  {
    tag-name: 'documentation',
    active: true
  },
  {
    tag-name: 'question',
    active: true
  },
  {
    tag-name: 'bug',
    active: true
  }
]
```
Provide a addTag function to the Hapi route handlers:

```
addTag('type_element_tagged', 'id_element', 'name_of_tag')
```
A first idea how to use it on a Hapi handler:

```
function (request, reply) {
  request.addTag('issue', '42' 'bug')
}
```

The addTag function will check if the 'type_element_tagged' already exists in PostgreSQL and add a new entry which link the id of the element with the id of the tag.

Provide a getTags function which get all the tags linked to an element:

```
getTags('type_element_tagged', 'id_element', callback)
```
In the Hapi handlers

```
function (request, reply) {
  request.getTags('issue', '42', function (error, tags){
     console.log(tags);
     return reply.view('issue', {listTags: tags});  
  })
}
```

Provide a getAllTags function which returns all the existing tags
```
function (request, reply) {
  request.getAllTags(function (error, tags){
     console.log(tags);
     return reply.view('allTags', {listTags: tags});  
  })
}
```

# Database Structure

### **Tags**
This table will list the details of _**all** tags_.

Each tag will detail:

| field  | data-type    |
| --------------------- |
| id     | integer      |
| name   | varchar(50)  |
| active | boolean      |

Each tag will have an _id_ associated to it, so that the name of the tag can be _changed_ as and when is convenient to the user. The id will be generated must remain fixed, so that a tag's name of activity status in the JSON file can be edited without ruining the link to tag in your other tables.

We assume here that the name of a tag or category will be _shorter_ than 50 characters, but this can easily be changed.

# how

- Install the package ```npm install tags-postgres --save```
- Create a postgres database called `tags`
- Create a json file on your app which represent the tags
- register the plugin in your app:
```
server.register([
    { register: require('tags-postgres'), options: options }
], function () {
    server.route(routes);
    server.start();
});
```

where options is

```
{
  tags: require('tags.json') // the json file which Initialise the tags database
  tagsPool: the_postgres_pool
}
```

# Why??

- independent system, just require this plugin instead of creating a new tags system in your app
- works with your existing project and database. Adding a tag will create the right table and element in postres without intefering with your existing database

# Questions?

- Is adding a function to the request object the best way to provide functionality everywhere on the Hapi app?


# Next iteration

- Create categories which are a set of specific tags. The categories will have their own table in PostgreSQL and the tags can be linked to one or multiple categories

- Create UI to add and delete tags instead of using a json config file. **This will require to have an authentication system to allow only specific users to modify the tags table.**
