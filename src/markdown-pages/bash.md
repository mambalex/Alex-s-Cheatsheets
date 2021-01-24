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
name="John"
echo $x
echo $0    # ./a.sh
echo $1	   # Arg1
echo $@    # An array of all args
echo $#    # Number of args
echo $?    # Exit status
echo $$    # PID of shell
```

See: [Special Parameters](https://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html)

## Strings

```bash
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
```

## Read

{col-1/2}

```bash
echo -n "What is your name?"
read name
echo $name
```
