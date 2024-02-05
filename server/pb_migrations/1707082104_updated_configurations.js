/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hffhie0v",
    "name": "width",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cxrxfs2z",
    "name": "height",
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

  // remove
  collection.schema.removeField("hffhie0v")

  // remove
  collection.schema.removeField("cxrxfs2z")

  return dao.saveCollection(collection)
})
