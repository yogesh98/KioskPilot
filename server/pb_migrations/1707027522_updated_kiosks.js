/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m0prhf5istc7h7q")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.verified = true"
  collection.updateRule = "@request.auth.verified = true"
  collection.deleteRule = "@request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m0prhf5istc7h7q")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
