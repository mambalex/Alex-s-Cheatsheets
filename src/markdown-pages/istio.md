---
title: Istio
slug: "/istio"
order: 4
description: Istio cheat sheet
---

## Virtual Service

```yaml
kind: VirtualService
apiVersion: networking.istio.io/v1alpha3
metadata:
	# "just" a name for this virtualservice
  name: a-set-of-routing-rules-we-can-call-this-anything
  namespace: default
spec:
  hosts:
    # best practice: use Fully qualified domain name
    - mysvc.default.svc.cluster.local
# The Service DNS (ie the regular K8S Service) name that we're applying routing rules to.
  http:
    - route:
        - destination:
            host: mysvc.default.svc.cluster.local # The Target DNS name
            subset: safe-group  # The name defined in the DestinationRule
          weight: 90
        - destination:
            host: mysvc.default.svc.cluster.local
            subset: risky-group
          weight: 10
```

## Destination Rule

```yaml
# Defining which pods should be part of each subset
kind: DestinationRule
apiVersion: networking.istio.io/v1alpha3
metadata:
  name: grouping-rules-for-our-photograph-canary-release # This can be anything you like.
  namespace: default
spec:
  host: mysvc # Service
  trafficPolicy: ~
  subsets:
    - labels: # SELECTOR.
        version: safe # find pods with label "safe"
      name: safe-group
    - labels:
        version: risky
      name: risky-group
```
