/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "m0prhf5istc7h7q",
    "created": "2024-02-04 05:06:27.031Z",
    "updated": "2024-02-04 05:06:27.031Z",
    "name": "kiosks",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6uevsj6d",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("m0prhf5istc7h7q");

  return dao.deleteCollection(collection);
})
