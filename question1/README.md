# Simple API

The service is deployed (as a docker container) in AWS using Fargate.  It is available from the following endpoint:

http://simple-api-519366531.us-east-2.elb.amazonaws.com/

Here are examples of using the service:

```bash
# add a message...
curl -X POST -H "Content-Type: application/json" -d '{"message": "test"}' http://simple-api-519366531.us-east-2.elb.amazonaws.com/messages

{"digest":"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"}

# retrieve a message...
curl http://simple-api-519366531.us-east-2.elb.amazonaws.com/messages/9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08

{"message":"test"}
```

## Performance and Scaling
Performance (specifically throughput of a single replica) could be improved by making the [hash generating call](./routes.js#L14) asynchronous.  This would allow multiple requests to be handled in parallel (based on the CPU resources available).

The app currently stores the hash / message pairs in memory.  This does not scale well because:

1. multiple replicas of the app can not be run (because the message store is not shared)
1. the memory required will increases with every unique message posted
1. if the app re-starts all data will be lost

A solution would be to use a key value store like Redis or Memcached.  This would allow:

1. horizontal scaling of the app.  The CPU intensive `POST` requests could be load balanced across a pool of replicas.  The replica count could auto-scale based on the aggregate CPU used across the pool.
1. simple mechanism for expiring messages over time (if desired)
1. message data would persist when individual app replicas restarted (including when new versions of the app were redeployed)

## Development

You can run the docker container locally using the following command:

```bash
docker run -it --rm -p3000:3000 dougsc/simple-api:1.0.2
```

Then connect to it on port 3000 (or the port of your choice) e.g,

```bash
curl http://localhost:3000/health
```

If you have a nodeJs environment (version 8 or higher) you can build the app using:

```bash
npm install
```

And then run it using...

```bash
HTTP_PORT=<desired port> npm start
```

You can run lint and tests using the following commands:

```bash
npm run lint
npm run test
```

