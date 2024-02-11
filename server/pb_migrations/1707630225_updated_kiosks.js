/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m0prhf5istc7h7q")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asrkr00k",
    "name": "configuration",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "a1q1zk5bgcda6wx",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m0prhf5istc7h7q")

  // remove
  collection.schema.removeField("asrkr00k")

  return dao.saveCollection(collection)
})
