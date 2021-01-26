---
title: Linux
slug: "/linux"
order: 3
description: Linux cheatsheet
---

## Server Info

{col-1/2}

```bash
uname -a
uptime
arch
cat /etc/*-release
```

## Disk

{col-1/2}

```bash
df -h
df -i
du -sh /var/log
lsof
iotop
cat /proc/PID/io
```

## Memory

{col-1/2}

```bash
free -h
sudo grep -i -r 'out of memory' /var/log/
cat /proc/PID/oom_score
```

## Process

```bash
top
ps aux
systemctl list-units --type service --state running
journalctl
lsof -p 1192 | grep log # where is process 1192 logging to

```

## Network

```bash
ip link                        # Layer1: physical layer. interface is up?
ip link set eth1 up

ip neighbor show               # Layer2: data link layer. ARP table(resolve MAC)?

ip addr                        # Layer3: network layer. has ip address?
ip a add x.x.x.x/24 dev eth0
ip route                       # check default gateway
route add default gw x.x.x.x

ping google.com
nslookup google.com
cat /etc/resolv.conf
traceroute
netstat -antlup        # Layer4: transport layer. TCP/UDP
lsof -i :22            # which process is listening on port 22
```

## Firewall

{col-2/2}

```bash
## Ubuntu & Debian
systemctl disable ufw
ufw disable
ufw status              # show all rules
ufw allow ssh
ufw allow http
```

```bash
## CentOS 7
systemctl stop firewalld
systemctl disable firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --reload
```

```bash
sudo iptables -L        # Default is ACCEPT all
service iptables stop
setenforce 0
```
