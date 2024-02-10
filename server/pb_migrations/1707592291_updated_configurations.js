/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx")

  // remove
  collection.schema.removeField("sjjtzjzj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gudvawam",
    "name": "pages",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sjjtzjzj",
    "name": "config",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // remove
  collection.schema.removeField("gudvawam")

  return dao.saveCollection(collection)
})
