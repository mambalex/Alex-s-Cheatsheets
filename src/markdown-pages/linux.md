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

## Utilities

```bash
type -a whoami # whoami is /usr/bin/whoami
man whoami
type -a if     # if is a shell keyword
help if

# Create the user
useradd -m alex   # create home dir
# Set the password
echo ${PASSWORD} | passed --stdin ${USER_NAME}  # Centos
echo "username:password" | chpasswd             # Ubuntu
# Force password  change on first login
passed -e ${USER_NAME}

basename /var/log/myLog.log # myLog.log
dirname /var/log/myLog.log  # /var/log

# Find a command that is not in the PATH
which userdel
# Fast. It doesn't read the file system, but refers to a database(not realtime)
locate userdel
sudo updatedb  # update the database
# find
find / -name userdel

######################################## sed ########################################
# By default
# 1. Case sensitive
# 2. Only replaces the first occurrence of the search pattern of the line
# 3. Apply to all lines

cat manager.txt                  # John is the assitant regional manager.
sed 's/John/Sam/' manager.txt    # Sam is the assitant regional manager.  (sustitution)

sed 's/JOHN/Sam/i' manager.txt   # case insensitive

# Address
sed '2 s/apache/httpd/' config          # sed the second line
sed '1,4 s/apache/httpd/' config        # sed line1-4
sed '/Group/ s/apache/httpd' config     # regex search /Group/ then sed

# Occurrence
sed 's/John/Sam/2' manager.txt   # replaces the second occurrence of John
sed 's/John/Sam/g' manager.txt   # replaces all occurrences

# Editting
sed -i 's/John/Sam/g' manager.txt       # In place editting
sed -i.bak 's/John/Sam/g' manager.txt   # Generate a backup file (manager.txt.bak)
sed 's/John/Sam/gw Sam.txt' manager.txt # Create a new file with the output

# Delimiter
echo '/home/jason' | sed 's/\/home\/jason/\/my\/new\/dir/'  # /my/new/dir.  escaping /
echo '/home/jason' | sed 's#/home/jason#/my/new/dir#'       # uses # as delimiter

# Deleting
sed '/This line/d' manager.txt   # delete the lines that matches the search pattern
sed '/^#/d' config
sed '/^$/d' config                             # delete blank lines

# Multi-command
sed '/^#/d; /^$/d; s/apache/httpd/g' config    # combine multiple sed commands
sed -e '/^#/d' -e ' /^$/d' -e 's/apache/httpd/g' config

# Script file
echo '/^#/d' > script.sed
sed -f script.sed config



######################################## cut ########################################
cut -c 1 /etc/passwd    # cut lines by character
cut -c 4-7 /etc/passwd
cut -c 4- /etc/passwd
cut -c 1,3,5 /etc/passwd

echo -e 'one\ttwo\tthree' | cut -f 1     # cut lines by field (default delimiter is Tab)
echo 'one,two,three' | cut -d ',' -f 2   # set delimiter to ,
cut -d 'DATA:' -f 2 myfile.csv           # ❌ The delimiter must be a single character


######################################## awk ########################################
awk -F 'DATA:' '{print $2}' myfile.csv   # ✅ Handles muli-character delimiter
awk -F ':' '{print $1, $3}' myfile.csv   # default output field separator is space
awk -F ':'  -v OFS=',' '{print $1, $3}' myfile.csv  # change OFS to ,
awk -F ':' '{print $1 "," $3}' myfile.csv # alternative
awk -F ':' '{print $3, $1}' myfile.csv    # display the 3rd filed first

# highlight-range{1}
awk -F ':' '{print $NF}' /etc/passwd      # print the last filed for every line
awk -F ':' '{print $(NF - 1)}' /etc/passwd

cat lines
# L1C1        L1C2
#     L2C1 L2C2
#   L3C1          L3C2
# L4C1      L4C2
awk '{print $1, $2}' lines        # none whitespace characters to be a filed by default
# L1C1 L1C2
# L2C1 L2C2
# ...

######################################## sort ########################################
sort /etc/passwd
sort -r  /etc/passwd    # reverse
sort -n                 # numeric sort
sort -u                 # unique
du -h /var | sort -h    # human readable numeric sort (e.g. 2K 1G)


######################################## uniq ########################################
sort | uniq      # have to sort the data before applying uniq
uniq -c          # count the number of occurrences
sudo cat /var/log/messages | awk '{print $5}' | sort | uniq -c | sort -n


######################################## wc ########################################
wc /etc/passwd
# 25 50 1245 /etc/passwd    -> #lines #words #characters
wc -w          # words
wc -c          # characters
wc -l          # lines

######################################## tee ########################################
# Read from standard input and write to standard output and files

sudo echo '10.9.8.11 mySV' >> /etc/hosts  # ❌ Only running sudo on echo, not on >>
# Permission denied

echo '10.9.8.11 mySV' | sudo tee -a /etc/hosts # ✅

```
