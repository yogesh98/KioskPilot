/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cw1jjv2l",
    "name": "files",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 99,
      "maxSize": 5368709120,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cw1jjv2l",
    "name": "files",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 99,
      "maxSize": 52428800,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
