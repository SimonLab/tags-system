# tags-system
[![Build Status](https://travis-ci.org/postgres-plugin/tags-system.svg?branch=master)](https://travis-ci.org/postgres-plugin/tags-system)
[![codecov](https://codecov.io/gh/postgres-plugin/tags-system/branch/master/graph/badge.svg)](https://codecov.io/gh/postgres-plugin/tags-system)

tags-system is an Hapi plugin which allow you to use tags on your application. When registered to a Hapi server the plugin will automatically create the tables tag, categories and tags_categories in Postgres:

### Tags

| field  | data-type    |
| --------------------- |
| id     | integer      |
| name   | varchar(50)  |
| active | boolean      |

### categories

| field  | data-type    |
| --------------------- |
| id     | integer      |
| name   | varchar(50)  |
| active | boolean      |

### tags_categories


| field    | data-type     |
| ------------------------ |
| tags_id        | integer |
| categories_id  | integer |

The tags-system plugin take also an option where the content of these tables can be passed. This allow to initialise quickly the tables:

### plugin options:
```
{
  tags: require('./data/tags.json') // the json file which Initialise the tags database
  categories: require(./data/categories.json) // the json file which Initialise the categories
  pool: the_postgres_pool
}
```

# Functions
### _addTags(tableName, itemId, tagIds, cb)_
tableName = 'organisations' or 'challenges'
itemId represents the id of the org or challenge you want to add tags to
tagIds = an array of all tag ids you now want related to the given org/challenge


### _getAllActive(cb)_
returns a parent array of active categories containing child arrays of active child tags.
Each member of the parent array is of the form:
```js
{ category_id: 9,
  category_name: 'BIOLOGICAL CYCLE',
  tags:
  [ { tag_id: 87, tag_name: 'Agriculture',              selected: false },
    { tag_id: 89, tag_name: 'Anaerobic digestion',      selected: false },
    { tag_id: 91, tag_name: 'Biochemical extraction',   selected: false  }
]
}
```
The categories array and the inner tags array are ordered alphabetically.
If no categories or tags are found, it will return an empty array.
"selected" will always be false when using _getAllActive_



### _getTagsForEdit(tableName, id, cb)_
Similar to _getAllActive_ function.
At the moment, tableName can be 'challenges', in the future we will be able to call it with 'organisations'
returns an array of active categories and active child tags with objects of the form:
```js
[
  { category_id: 9,
    category_name: 'BIOLOGICAL CYCLE',
    selected: true, // `selected: true` will only be present when category has a selected child tag
    tags:
    [ { tag_id: 87, tag_name: 'Agriculture',              selected: false },
      { tag_id: 89, tag_name: 'Anaerobic digestion',      selected: false },
      { tag_id: 91, tag_name: 'Biochemical extraction',   selected: true  }
    ]
  },
  { category_id: 1,
    category_name: 'MATH',
    // note there is no `selected: true`
    tags:
    [ { tag_id: 89, tag_name: 'Algebra',  selected: false } ]
  }
]
```
The categories array and the inner tags array are ordered alphabetically.
If no categories or tags are found, it will return an empty array.




# how

- Install the package ```npm install tags-system --save```
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

For a complete example you can have a look at the example folder of this plugin.

## Why??

- independent system, just require this plugin instead of creating a new tags system in your app
- works with your existing project and database. Adding a tag will create the right table and element in Postres without intefering with your existing database

## Questions?

Have a look at the [issues](https://github.com/postgres-plugin/tags-system/issues)
