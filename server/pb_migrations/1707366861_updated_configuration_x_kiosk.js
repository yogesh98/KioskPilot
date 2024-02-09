/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("naxb7jh20xq5nk9")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_ISx7QLI` ON `configuration_x_kiosk` (`kiosk`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("naxb7jh20xq5nk9")

  collection.indexes = []

  return dao.saveCollection(collection)
})
