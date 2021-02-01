---
title: Python
slug: "/python"
order: 8
description: Python cheatsheet
---

## Variables

```python
# Data types
x = 1             # int
y = 2.5           # float
name = 'Alex'     # string
is_cool = True    # bool

# Multiple assignment
x, y, name, is_cool = (1, 2.5, 'Alex', True)

# Casting
x = str(x)
y = int(y)
z = float(y)

# Check type
print(type(z))    # <class 'float'>
print(z)          # 2.0
```

## Strings

```python
name = 'Alex'
age = 27

# Concatenate
print('Hello I am ' + name + ' and I am ' + str(age))

# String Formatting
print('{}, {}, {}'.format('a', 'b', 'c'))
print('{1}, {2}, {0}'.format('a', 'b', 'c'))
print('My name is {name} and I am {age}'.format(name=name, age=age))
print(f'My name is {name} and I am {age}')  # F-Strings (only in 3.6+)

# String Methods
s = 'hello there world'
len(s)              # 17
s[-1]               # d
s[:4]               # hello
s[2:5]              # llo

s.split()           # ['hello', 'there', 'world']
s.find('o')         # 4  returns -1 when it does not find the substring
s.index('o')        # 4  while index() raises ValueError
s.count('h')        # 2
s.replace('world', 'everyone'))   # hello there everyone

s.capitalize()      # Hello there world
s.upper()           # HELLO THERE WORLD
s.lower()           # hello there world
s.swapcase()        # HELLO THERE WORLD

s.startswith('he')  # True
s.endswith('d')     # True

s.isalnum()         # False  (a-z)|(0-9)
s.isalpha()         # False
s.isnumeric()       # False

```

## Lists

```python
fruits = ['Apples', 'Oranges', 'Grapes', 'Pears']
numbers = list((1,2,3,4,5))

fruits[1]                 # Oranges
len(fruits)               # 4
fruits.count('Apples')    # 1

fruits.append('Mangos')   # ['Apples', 'Oranges', 'Grapes', 'Pears', 'Mangos']
fruits.insert(2, 'Kiwis') # ['Apples', 'Oranges', 'Kiwis', 'Grapes', 'Pears']

fruits.remove('Grapes')   # ['Apples', 'Oranges', 'Pears']
myFruit = fruits.pop()    # myFruit = 'Pears', fruits = ['Apples', 'Oranges', 'Grapes']
myFruit = fruits.pop(1)   # myFruit = 'Oranges'

fruits.reverse()          # ['Pears', 'Grapes', 'Oranges', 'Apples']

fruits.sort()             # ['Apples', 'Grapes', 'Oranges', 'Pears']
fruits.sort(reverse=True) # ['Pears', 'Oranges', 'Grapes', 'Apples']
sorted(fruits)

",".join(fruits)          # 'Apples,Oranges,Grapes,Pears'
```

## Dictionaries

```python

person = {
  'first_name': 'John',
  'last_name': 'Doe',
  'age': 30
}
person = dict(first_name='John', last_name='Doe',age=30)

'age' in person          # True
'John' in person         # False

person['first_name']     # John
person.get('last_name')  # Doe

person['ageeee']         # KeyError: 'ageeee'
person.get('ageeee')     # returns 'None'

print(person.keys())     # dict_keys(['first_name', 'last_name', 'age'])
print(person.items())    # dict_items([('first_name', 'John'), ('last_name', 'Doe'), ('age', 30)])

for key in person.keys():
    print(key)

for key, val in person.items():
    print(key, val)

person['phone'] = '555-555'         # Add key/value
del(person['age'])                  # Delete key/value
lastName = person.pop('last_name')  # Doe, person {'first_name': 'John', 'phone': '555-555'}
person.clear()                      # {}

person2 = person.copy()
person2['city'] = 'Boston'
print(len(person2))   # 4
print(person)         # {'first_name': 'John', 'last_name': 'Doe', 'age': 30}
```

## Sets

```python
# Unordered | unindexed
# No duplicate items

fruit_set = {'Apple', 'Orange', 'Mango'}

fruit_set.add('Grape')
fruit_set.remove('Grape')
fruit_set.clear()                # set()

print('Apple' in fruit_set)      # True

del fruit_set
```

## Tuples

```python
# Ordered | indexed
# Unchangeable
# Allow duplicate items

fruit_tuple = ('Apple', 'Orange', 'Mango')
fruit_tuple = tuple(('Apple', 'Orange', 'Mango'))
# Tuples with one value should have trailing comma
fruit_tuple_2 = ('Apple',)

print(fruit_tuple[1])    # Orange

fruit_tuple[1] = 'Grape'  ❌
# TypeError: 'tuple' object does not support item assignment

print(len(fruit_tuple)) # 3

del fruit_tuple
```

## Loops

```python
people = ['John', 'Will', 'Janet', 'Karen', 'Sam']

for person in people:      # JOHN! Will
  if person == 'John':
    print('JOHN!')
  elif person == 'Janet':
    continue
  elif person == 'Karen':
    break
  else:
    print(person)

for i in range(len(people)): # 0 to 4
  print('Current Person: ', people[i])

for i in range(3, 5):        # 3 4
for i in range(0, 10, 2):    # 0 2 4 6 8
for item in ["a", "b", "c"]:
for key, val in dict.items():
for index, person in enumerate(people):

i = 1
while i < 8:
  print(i)
  i += 1
```

## Conditionals

```python
if x == y:
  print(f'{x} is equal to {y}'

if x > 2 and x <=10:
  print(f'{x} is less than 2 and greater than 10')

if x > 2 or x <=10:
  print(f'{x} is less than 2 or greater than 10')

if not(x == y):
  print(f'{x} is not equal to {y}')

# Membership Operators
numbers = [1,2,3,4,5]
isTrue = (2 in numbers)    # True
if x in numbers:
if x not in numbers:

# Identity Operators
if x is y:
  print(x is y)

if x is not y:
  print(x is not y)
```

## Functions

```python
def sayHello(name = 'Alex'):
  print('Hello ' + name)

sayHello()            # Hello Alex
sayHello('Lucy')      # Hello Lucy

def addOneToNum(num):
  num += 1            # Local Scope
  return num

num = 5
new_num = addOneToNum(num)
print(num, new_num)          # 5 6

x = 200

# By default, functions can read global variables, but cannot write
def myFunc():
  print(x)

myFunc()       # 200

# Local scope VS global scope
def myfunc2():
  # highlight-range{1}
  x = 100      # declare local x
  print(x)

myFunc2()      # 100  local x
print(x)       # 200  global x

# Modify global variable
def myfunc():
  # highlight-range{1-2}
  global x
  x = 300      # overwrite global x

myfunc()
print(x)      # 300

########################## Lambda functions ##########################
getSum = lambda num1, num2 : num1 + num2
print(getSum(9, 2))   # 11
```

## Classes

```python
class User:
  # Constructor
  def __init__(self, name, email, age):
    self.name = name
    self.email = email
    self.age = age

  def greeting(self):
    print(f'My name is {self.name} and I am {self.age}')

  def has_birthday(self):
    self.age += 1

class Customer(User):  # extends the class User
  def __init__(self, name, email, age):
    self.name = name
    self.email = email
    self.age = age
    self.balance = 0

  def set_balance(self, balance):
    self.balance = balance

  def greeting(self):  # overriding the greeting method in User
    print(f'My name is {self.name} and I am {self.age} and I owe a balance of {self.balance}')

alex = User('Alex Zhang', 'alex@gmail.com', 27)
dame = User('Dame Williams', 'dame@gmail.com', 30)

alex.age              # 27
alex.greeting()

john = Customer('John Doe', 'john@gmail.com', 40)
john.set_balance(500)
john.greeting()
```

## Exception handling

```python

def divide(a,b):
  try:
      output = a / b
  except ZeroDivisionError:
      print('Cannot divide by zero')
  except TypeError:
      print('Sorry, a and b must be number')
  else:
      print('Output = {0}'.format(output))
  finally:
      print('Leaving the function')  # Always executes

raise KeyError      # raise an exception manually
```

See: [Built-in exceptions](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)

## Modules

{col-2/2}

```python
from validator import validate_email

email = 'test@test.com'

if validate_email(email):
  print('Email is valid')
else:
  print('Not an email')
```

```python
# validator.py
import re

regex="^.+@(\[?)[a-zA-Z0-9-.]+.([a-zA-Z]{2,3}|[0-9]{1,3})(]?)$"

def validate_email(email):
    if len(email) > 7:
        return bool(re.match(regex, email))

```

## Files

```python
"""
Reading: r

Writing:
  Truncate:  w
  Does not truncate: a

Reading and Writing:
  Truncate: w+
  Does not truncate: a+, r+
"""

################################ Read ################################
myFile = open('myfile.txt', 'r')         # read mode
myFile = open('myfile.txt')              # default mode

print('Name: ', myFile.name)             # myfile.txt
print('Is Closed: ', myFile.closed)      # False
print('Opening Mode: ', myFile.mode)     # r

# Treat each character in the file separately
myFile.read()     # read the entire file and set the cursor at the end of file
myFile.readline() # read one line

# Treat each line as an element
myFile.readlines()
myFile.seek(0, 0)       # place the cursor at the beggining of the file

for char in myFile.read():
for line in myFile.readlines():

myFile.close()    # close the file

################################ Write ################################
myFile = open('myfile.txt', 'w')
myFile.write('I love Python')
myFile.write(' and JavaScript')

################################ Append ################################
myFile = open('myfile.txt', 'a')
myFile.write(' I also like Kubernetes')

############################## with open() as ###########################
with open("welcome.txt", "r") as file:
   data = file.read()
# It closes the file automatically at the end of scope, no need for `file.close()`.
```

## OS

```python
import os

os.getcwd()                    # working directory. e.g. /home/alex
os.chdir('/etc')               # change working directory

os.listdir()                   # Listing. ['.bash_history', '.bashrc', '.ssh', '.profile']

os.mkdir('test_dir')           # Creating.
os.makedirs('p_dir/c_dir')

os.rmdir('test_dir')           # Deleting. Must be empty dir or raise OSError
os.removedirs("p_dir/c_dir")   # OSError: [Errno 39] Directory not empty
import shutil
shutil.rmtree('p_dir/c_dir')   # Will delete a directory and the files contained in it

os.rename('test', 'test1')     # Renaming

os.path.exists('/etc/resolv.conf')   # True
os.path.isfile('/etc/resolv.conf')   # Ture
os.path.isfile('/etc/resolv.conf')   # False

for dirpath, dirnames, filenames in os.walk('/parent_dir'):  # Loop through dir
  print(f"Files in '{dirpath}' are: ")
  for file in filenames:
    print('\t' + file)

os.environ.get('SHELL')         # Get Env variable
os.stat(file)                   # File stats

os.system('ls -la')             # return the exit status
```

## Regex

```python
"""
re.compile(): To create a regex object
re.search(): find a pattern in a string
re.match(): does this entire string conform to this pattern
re.findall(): find all patterns in this string and returns all the matches in it not just the first match
re.group(): to get the matched string
"""
import re

pattern = '^a...s$'
test_string = 'abyss'
result = re.match(pattern, test_string)

if result:
  print("Search successful.")
else:
  print("Search unsuccessful.")


message = "my number is 510–123–4567"
myRegex = re.compile(r'(\d\d\d)-(\d\d\d-\d\d\d\d)')
match = myRegex.search(message)
match.group()       # 510–123–4567
match.group(1)      # 510
match.group(2)      # 123–4567
```

## Json

```python
import json

userJSON = '{"first_name": "John", "last_name": "Doe", "age": 30}'

user = json.loads(userJSON)  # Parse json string to dict
print(user)                  # {'first_name': 'John', 'last_name': 'Doe', 'age': 30}
print(user['first_name'])    # John

with open("filename.json", "r") as f:
    content = json.loads(f.read())

car = {'make': 'Ford', 'model': 'Mustang', 'year': 1970}
carJSON = json.dumps(car)    # dict to str
print(type(carJSON))         # <class 'str'>
```

## Virtual Environment

```bash
pip install virtualenv
# Create a virtual env
python3 -m venv MY_ENV_NAME
# Activate
source MY_ENV_NAME/bin/activate
# Deactivate
deactivate
```
