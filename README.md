[![](https://img.shields.io/docker/pulls/zl0i/alertmanager-matrix-forwarder.svg)](https://hub.docker.com/r/zl0i/alertmanager-matrix-forwarder)
[![Artifact Hub](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/zloi-space)](https://artifacthub.io/packages/helm/zloi-space/alertmanager-matrix-forwarder)

# Matrix-Alertmanager

![](./screenshot.png)

A bot to receive Prometheus Alertmanager webhook events and forward them to chosen rooms.

Main features:

- Uses pre-created Matrix user to send alerts using passwrod.
- Configurable room per alert receiver.
- Automatic joining of configured rooms. Private rooms require an invite.
- Secret key authentication with Alertmanager.
- HTML formatted messages.
- Optionally mentions `@room` on firing alerts
- Prometheus metrixs

## How to use

### Configuration

Whether running manually or via the Docker image, the configuration is set
via environment variables.

### Docker

The [Docker image](https://hub.docker.com/r/zl0i/alertmanager-matrix-forwarder) `zl0i/alertmanager-matrix-forwarder:latest` is the easiest way to get the service running. Ensure you set the required environment variables listed in `.env.default` in this repository.

### Alertmanager

You will need to configure a webhook receiver in Alertmanager. It should looks something like this:

```yaml
receivers:
  - name: 'myreceiver'
    webhook_configs:
      - url: 'https://my-matrix-alertmanager.tld/alerts?secret=veryverysecretkeyhere'
```

The secret key obviously should match the one in the alertmanager configuration.

### Prometheus rules

Add some styling to your prometheus rules

```yaml
rules:
  - alert: High Memory Usage of Container
    annotations:
      description: Container named <strong>{{\$labels.container_name}}</strong> in <strong>{{\$labels.pod_name}}</strong> in <strong>{{\$labels.namespace}}</strong> is using more than 75% of Memory Limit
    expr: |
      ((( sum(container_memory_usage_bytes{image!=\"\",container_name!=\"POD\", namespace!=\"kube-system\"}) by (namespace,container_name,pod_name, instance)  / sum(container_spec_memory_limit_bytes{image!=\"\",container_name!=\"POD\",namespace!=\"kube-system\"}) by (namespace,container_name,pod_name, instance) ) * 100 ) < +Inf ) > 75
    for: 5m
    labels:
      team: dev
```

NOTE! Currently the bot cannot talk HTTPS, so you need to have a reverse proxy in place to terminate SSL, or use unsecure unencrypted connections.

## Tech

Node 16, Express, Matrix JS SDK

## Author

Dmitri Popov / https://zloi.space

Fork from: https://github.com/jaywink/matrix-alertmanager

## License

MIT
