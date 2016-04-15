'use strict'


var Services = [
  {
    "key": "pdfpreview",
    "label": "PDF Preview Extractor",
    "description": "Clowder extractor for PDF preview thumbnails",
    "maintainer": "",
    "requiresVolume": false,
    "config": [
      {
        "name": "RABBITMQ_EXCHANGE",
        "value": "clowder",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_VHOST",
        "value": "%2F",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_QUEUE",
        "value": "ncsa.pdf.preview",
        "label": "",
        "isPassword": false,
        "canOverride": false
      }
    ],
    "image": "bodom0015/pdf-preview",
    "ports": null,
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": null,
    "args": null,
    "command": null,
    "depends": [
      {
        "key": "rabbitmq",
        "required": true,
        "shareConfig": false
      }
    ],
    "access": "internal",
    "display": ""
  },
  {
    "key": "videopreview",
    "label": "Video Preview Extractor",
    "description": "Clowder extractor for creating a series of preview shots from a video",
    "maintainer": "",
    "requiresVolume": false,
    "config": [
      {
        "name": "RABBITMQ_EXCHANGE",
        "value": "clowder",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_VHOST",
        "value": "%2F",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_QUEUE",
        "value": "ncsa.video.preview",
        "label": "",
        "isPassword": false,
        "canOverride": false
      }
    ],
    "image": "ndslabs/video-preview:0.9.2",
    "ports": null,
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": null,
    "args": null,
    "command": null,
    "depends": [
      {
        "key": "rabbitmq",
        "required": true,
        "shareConfig": false
      }
    ],
    "access": "internal",
    "display": ""
  },
  {
    "key": "clowder",
    "label": "Clowder",
    "description": "A scalable data repository where you can share, organize and analyze data.",
    "maintainer": "",
    "requiresVolume": false,
    "config": [
      {
        "name": "SMTP_HOST",
        "value": "smtp.ncsa.illinois.edu",
        "label": "",
        "isPassword": false,
        "canOverride": true
      },
      {
        "name": "ELASTICSEARCH_CLUSTERNAME",
        "value": "clowder",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_EXCHANGE",
        "value": "clowder",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "TOOLMANAGER_URI",
        "value": "http://localhost:8082",
        "label": "ToolServer address",
        "isPassword": false,
        "canOverride": true
      }
    ],
    "image": "ndslabs/clowder:0.9.2",
    "ports": [
      {
        "port": 9000,
        "protocol": "http"
      }
    ],
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": null,
    "args": null,
    "command": null,
    "depends": [
      {
        "key": "mongo",
        "required": true,
        "shareConfig": false
      },
      {
        "key": "elasticsearch",
        "required": false,
        "shareConfig": false
      },
      {
        "key": "imagepreview",
        "required": false,
        "shareConfig": false
      },
      {
        "key": "pdfpreview",
        "required": false,
        "shareConfig": false
      },
      {
        "key": "audiopreview",
        "required": false,
        "shareConfig": false
      },
      {
        "key": "videopreview",
        "required": false,
        "shareConfig": false
      }
    ],
    "access": "external",
    "display": "stack"
  },
  {
    "key": "mongo",
    "label": "MongoDB",
    "description": "A cross-platform document-oriented NoSQL database",
    "maintainer": "",
    "requiresVolume": false,
    "config": null,
    "image": "mongo:3.2.4",
    "ports": [
      {
        "port": 27017,
        "protocol": "tcp"
      }
    ],
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": [
      {
        "mountPath": "/data/db",
        "name": "mongo"
      }
    ],
    "args": null,
    "command": null,
    "depends": null,
    "access": "internal",
    "display": "standalone"
  },
  {
    "key": "audiopreview",
    "label": "Audio Preview Extractor",
    "description": "Clowder extractor for audio preview clips",
    "maintainer": "",
    "requiresVolume": false,
    "config": [
      {
        "name": "RABBITMQ_EXCHANGE",
        "value": "clowder",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_VHOST",
        "value": "%2F",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_QUEUE",
        "value": "ncsa.audio.preview",
        "label": "",
        "isPassword": false,
        "canOverride": false
      }
    ],
    "image": "bodom0015/audio-preview:latest",
    "ports": null,
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": null,
    "args": null,
    "command": null,
    "depends": [
      {
        "key": "rabbitmq",
        "required": true,
        "shareConfig": false
      }
    ],
    "access": "internal",
    "display": ""
  },
  {
    "key": "elasticsearch",
    "label": "ElasticSearch 1.x",
    "description": "A distributed search and analytics engine",
    "maintainer": "",
    "requiresVolume": false,
    "config": null,
    "image": "elasticsearch:1.3",
    "ports": [
      {
        "port": 9300,
        "protocol": "tcp"
      }
    ],
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": null,
    "args": [
      "-Des.cluster.name=clowder"
    ],
    "command": null,
    "depends": null,
    "access": "internal",
    "display": ""
  },
  {
    "key": "imagepreview",
    "label": "Image Preview Extractor",
    "description": "Clowder extractor for image preview thumbnails",
    "maintainer": "",
    "requiresVolume": false,
    "config": [
      {
        "name": "RABBITMQ_EXCHANGE",
        "value": "clowder",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_VHOST",
        "value": "%2F",
        "label": "",
        "isPassword": false,
        "canOverride": false
      },
      {
        "name": "RABBITMQ_QUEUE",
        "value": "ncsa.image.preview",
        "label": "",
        "isPassword": false,
        "canOverride": false
      }
    ],
    "image": "ndslabs/image-preview:0.9.2",
    "ports": null,
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": null,
    "args": null,
    "command": null,
    "depends": [
      {
        "key": "rabbitmq",
        "required": true,
        "shareConfig": false
      }
    ],
    "access": "internal",
    "display": ""
  },
  {
    "key": "rabbitmq",
    "label": "RabbitMQ",
    "description": "A highly reliable enterprise messaging system",
    "maintainer": "",
    "requiresVolume": false,
    "config": null,
    "image": "rabbitmq:3.6.1-management",
    "ports": [
      {
        "port": 5672,
        "protocol": "tcp"
      },
      {
        "port": 15672,
        "protocol": "tcp"
      }
    ],
    "createdTime": 0,
    "updateTime": 0,
    "readinessProbe": {
      "type": "",
      "path": "",
      "port": 0,
      "initialDelay": 0,
      "timeout": 0
    },
    "volumeMounts": null,
    "args": null,
    "command": null,
    "depends": null,
    "access": "internal",
    "display": "standalone"
  }
]; 

module.exports = Services;