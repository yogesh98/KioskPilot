/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s9eah5y6",
    "name": "columns",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s9eah5y6",
    "name": "column",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
})
