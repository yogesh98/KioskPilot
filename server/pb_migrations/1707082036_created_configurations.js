/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "a1q1zk5bgcda6wx",
    "created": "2024-02-04 21:27:16.053Z",
    "updated": "2024-02-04 21:27:16.053Z",
    "name": "configurations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dy8fyzjl",
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
  const collection = dao.findCollectionByNameOrId("a1q1zk5bgcda6wx");

  return dao.deleteCollection(collection);
})
