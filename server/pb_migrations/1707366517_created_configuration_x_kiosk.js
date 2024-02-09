/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "naxb7jh20xq5nk9",
    "created": "2024-02-08 04:28:37.164Z",
    "updated": "2024-02-08 04:28:37.164Z",
    "name": "configuration_x_kiosk",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "brynnm2n",
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
      },
      {
        "system": false,
        "id": "nfecsjpb",
        "name": "kiosk",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "m0prhf5istc7h7q",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("naxb7jh20xq5nk9");

  return dao.deleteCollection(collection);
})
