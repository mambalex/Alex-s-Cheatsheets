---
title: Bash
slug: "/bash"
order: 1
description: Testing out custom syntax highlighting options
---

## Strict mode

{col-2/2}

```bash
#/bin/bash

set -euo pipefail
```

See: [Bash strict mode](https://delightlylinux.wordpress.com/2020/02/16/bash-ifs-what-is-the-internal-field-separator/)

```bash
#/bin/bash

IFS=$'\n\t'
```

## Special parameters

{col-1/2}

```bash
echo $x
echo $0    # ./a.sh
echo $1	   # Arg1
echo $@    # An array of all args
echo $#    # Number of args
echo $?    # Exit status
echo $$    # PID of shell
echo $UID  # UID of the current user. readonly
```

See: [Special Parameters](https://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html)

## Strings

```bash
WORD='script'       # WORD1, _WORD ✅  3WORD, A-WORD, E@EMAIL ❌

echo "$WORD"        #=>   script
echo '$WORD'        #=>   '$WORD'
echo "${WORD}ing is fun"   ✅
echo "$WORDing is fun"     ❌

name="John"
echo ${name/J/j}    #=> "john" (substitution)
echo ${name:0:2}    #=> "Jo" (slicing)
echo ${name::-1}    #=> "Joh" (slicing)
echo ${#name}       #=>  Length of $name
b=`echo $name | sed s/ohn/ay/ `  # Jay
STR="HELLO WORLD!"
echo ${STR,,}  #=> "hello world!" (all lowercase)
echo ${STR^^}  #=> "HELLO WORLD!" (all uppercase)
```

## Arrays

```bash
Fruits=('Apple' 'Banana' 'Orange')
Fruits[0]="Apple"
echo ${Fruits[0]}           # Element #0
echo ${Fruits[-1]}          # Last element
echo ${Fruits[@]}           # All elements, space-separated
echo ${#Fruits[@]}          # Number of elements
echo ${#Fruits}             # String length of the 1st element
echo ${#Fruits[3]}          # String length of the Nth element
echo ${Fruits[@]:3:2}       # Range (from position 3, length 2)
echo ${!Fruits[@]}          # Keys of all elements, space-separated

Fruits+=('Watermelon')                  # Push
unset Fruits[2]                         # Remove one item
Fruits=("${Fruits[@]}" "${Veggies[@]}")
lines=(`cat "logfile"`)
for i in "${arrayName[@]}"; do
  echo $i
done

```

## Conditions

```bash
# string
if [[ $un == "admin" && "$pw" == "superuser" ]]; then
 echo "Login Successful."
fi

# number
if (( $a < $b )); then
   echo "$a is smaller than $b"
fi

# number
if [ $first -eq 0 ] && [ $second -eq 0 ]
then
	echo "Num1 and Num2 are zero"
elif [ $first -eq $second ]
then
	echo "Both Values are equal"
else
	echo "$first is lesser than $second"
fi

if [ ! -z $ip ] # Empty
if [ $? -eq 0 ] # exit 0
if [ -e $file ] # exists file
if [ ! -d "${home_dir}/.ssh" ] ; then  # dir exists
   mkdir -p "${home_dir}/.ssh"
fi
# grep
if ! grep "$key" "${dir}/.ssh/xs" > /dev/null 2>&1; then
	touch "${dir}/.ssh/authorized_keys"
fi
```

<br>

```bash
case "${1}" in
  start)
    vagrant up
    ;;
  status|state|--status|--state)
    echo 'Status:'
    ;;
  *)
    echo 'Supply a valid option.' >&2
    exit 1
    ;;
esac
```

## Loops

```bash
# Range
for i in {1..5}; do
    echo "Welcome $i"
done
for i in {5..50..5}; do
    echo "Welcome $i"
done
# C-like
for ((i = 0 ; i < 100 ; i++)); do
  echo $i
done
for i in /etc/rc.*; do
  echo $i
done
Fruits=('Apple' 'Banana' 'Orange')
for i in "${Fruits[@]}"; do
  echo $i
done

# Loop through all the positional parameters.
while [[ "${#}" -gt 0 ]]
do
  echo "Number of parameters: ${#}"
  echo "Parameter 1: ${1}"
  echo "Parameter 2: ${2}"
  echo "Parameter 3: ${3}"
  echo
  shift
done
```

## Functions

```bash
log() {
  # This function sends a message to syslog and to standard output if VERBOSE is true.
  local MESSAGE="${@}"
  if [[ "${VERBOSE}" = 'true' ]]
  then
    echo "${MESSAGE}"
  fi
  logger -t my-logger.sh "${MESSAGE}"
  # sudo tail /var/log/messages
  # Jan 11 17:55:01 localusers my-logger.sh: Hello!
}

backup_file() {
  # This function creates a backup of a file.  Returns non-zero status on error.
  local FILE="${1}"
  if [[ -f "${FILE}" ]]    # Make sure the file exists.
  then
    local BACKUP_FILE="/var/tmp/$(basename ${FILE}).$(date +%F-%N)"
    log "Backing up ${FILE} to ${BACKUP_FILE}."
    cp -p ${FILE} ${BACKUP_FILE}
  else
    return 1
  fi
}

readonly VERBOSE='true'
log 'Hello!'
backup_file /etc/passwd
```

## Arithmetic Operations

```bash
# Bash Arithmetic
NUM=$(( 1 + 2 ))
NUM=$(( 6 /4 ))   # 1   Bash drops off the decimal point and anything after it
(( NUM ++ ))

DICEA='3'
DICEB='6'
TOTAL=$(( DICEA + DICEB ))

if (( x > y )); then
    echo "x > y"
fi

# bc - Basic calculator
type -a bc          # bc is /usr/bin/bc
echo '6/4' | bc -l  # 1.50000000000000000000

# awk
awk 'BEGIN {print 6/4}' # 1.5

# let
type -a let        # let is a shell builtin
let NUM='3+3'
echo $NUm # 6

# expr
type -a expr       # expr is /usr/bin/expr
expr 1 + 1         # 2
NUM=$(expr 2 + 3)
```

## Read

{col-1/2}

```bash
echo -n "What is your name?"
read name

read -p "What is your name? " name  # prompt
echo $name
```

## Standard I/O/E

```bash
# File descriptor
# FD 0 - STDIN   FD 1 - STDOUT  FD 2 - STDERR
# <<, >>  append

# STDIN  (<)
read X < /etc/centos-release   # implicit
read X 0< /etc/centos-release  # explicit

# STDOUT (>)
echo $UID > myUID      # Redirect STDOUT to a file, overwriting the file.
echo $UID 1> myUID

# STDERR (2>)
head -n1 /fakefile 2> head.err
head -n1 /etc/hosts /fakefile > head.out 2> head.err
head -n1 /etc/hosts /fakefile > head.both 2>&1 # redirect STDERR to STDOUT
head -n1 /etc/hosts /fakefile &> head.both     # alternative syntax

# Pipe
head -n1 /etc/hosts /fakefile | cat      # only STDOUT will be passed through the pipe
head -n1 /etc/hosts /fakefile 2>&1 | cat # Redirect STDOUT and STDERR through a pipe.
head -n1 /etc/hosts /fakefile |& cat     # alternative syntax

# /dev/null
head -n3 /etc/passwd /fakefile > /dev/null     # Discard STDOUT
head -n3 /etc/passwd /fakefile 2> /dev/null    # Discard STDERR
head -n3 /etc/passwd /fakefile &> /dev/null    # Discard STDOUT and STDERR


```
