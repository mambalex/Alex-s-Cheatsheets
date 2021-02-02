---
title: Istio
slug: "/istio"
order: 5
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
  name: grouping-rules-for-our-photograph-canary-release
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

## Gateway

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: my-gateway
  namespace: istio-system
spec:
  selector:
    # use Istio default gateway implementation
    istio: ingressgateway
  servers:
    - port:
        number: 443
        name: https-kiali
        # Using HTTP instead of HTTPS, TLS termination at ELB
        protocol: HTTP
      hosts:
        - mydomain.io

---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: myVS
spec:
  hosts: # which incoming host are we applying the proxy rules to???
    - mydomain.io
  gateways:
    - my-gateway
  http:
    - match:
        - uri: # IF
            prefix: "/account"
      route: # THEN
        - destination:
            host: account-service-svc.default.svc.cluster.local
    - match:
        - uri: # IF
            prefix: "/message"
      route: # THEN
        - destination:
            host: message-service-svc.default.svc.cluster.local
```

## Mutual TLS

```yaml
# mTLS is automaticlly enabled by default
# Permissive mode. Allow normal http calls (Default)
# Strict mode. Reject all non-TLS connections

apiVersion: "security.istio.io/v1beta1"
kind: "PeerAuthentication"
metadata:
  name: "default"
  namespace: "istio-system"
spec:
  mtls:
    mode: STRICT
```

## Circuit Breaking

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: circuit-breaker-for-the-entire-default-namespace
spec:
  # This is the name of the k8s service that we're configuring
  host: "*.default.svc.cluster.local"
  trafficPolicy:
    outlierDetection: # Circuit Breakers HAVE TO BE SWITCHED ON
      maxEjectionPercent: 100
      consecutiveErrors: 10 ## only 502, 503 or 504
      interval: 5s
```

## Service Entry

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: testing-mysql
spec:
  hosts:
    - db.cniyfnzqimkt.xx.rds.amazonaws.com
  location: MESH_EXTERNAL
  resolution: DNS
  ports:
    - number: 3306
      name: tcp
      protocol: tcp
```

## JWT Authorization

```yaml
apiVersion: "security.istio.io/v1beta1"
kind: "AuthorizationPolicy"
metadata:
  name: "frontend-ingress"
  namespace: istio-system
spec:
  selector:
    matchLabels:
      istio: ingressgateway
  action: DENY
  rules:
    - from:
        - source:
            notRequestPrincipals: ["*"]
      to:
        - operation:
            paths: ["/storage/v*", "/account/v1/connection/*"]
```

<br>

```yaml
apiVersion: "security.istio.io/v1beta1"
kind: "RequestAuthentication"
metadata:
  name: "jwt-example"
  namespace: istio-system
spec:
  selector:
    matchLabels:
      istio: ingressgateway
  jwtRules:
    - issuer: https://cognito-idp.xx.amazonaws.com/xx
      jwksUri: https://cognito-idp.xx.amazonaws.com/xx/.well-known/jwks.json
  # - issuer: "ISSUER"
  #   jwks: |
  #    { "keys":[{"e":"AQAB","kty":"RSA","n":"wZnmAaWGneV5rPTxxx.."}]}
```
