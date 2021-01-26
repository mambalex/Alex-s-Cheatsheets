---
title: Golang
slug: "/golang"
order: 6
description: Golang cheatsheet
---

## CLI

```bash
go build main.go # Compile
CGO_ENABLED=0 GOOS=linux go build -o /go/bin/app
# Compile and run go program
go run main.go
# Add dependencies to current module and install them
go get
go test
```

## Variables

```go
package main
import "fmt"

func main() {
    // MAIN TYPES
    // string          zero value -> ""
    // bool            zero value -> false
    // int             zero value -> 0
    // int int8 int16 int32 int64
    // uint uint8 uint16 uint32 uint64 uintptr
    // byte - alias for uint8,
    // rune - alias for int32
    // float32 float64
    // complex64 complex128

    // Declaring
    var name string = "Alex"
    var name = "Alex"
    var age int = 27
    var isCool = false
    isCool = true
    // const isCool = true            // Can't resign

    // Shorthand
    lastname := "Zhang"
    lastname := "Lee"   // ❌ not redeclarable
    // Can be redeclared in short multi-variable declarations
    // where at least one new variable is introduced
    firstname, lastname := "Alex", "Zhang" // ✅

    fmt.Println(firstname, lastname, isCool)

}
```

## Arrays & Slices

```go
// Array:    Fixed length

// will be filled with so called zero values
var myArray1 = [3]int
// number of values between { } can not lager than size
var myArray2 = [5]int{1,2,3,4,5}
// the compiler will count the array elements for you
var myArray3 = […]int{1,2,3,4}
// Initialising multidimensional arrays
a := [3][4]int{
    {0, 1, 2, 3} , // initializers for row indexed by 0
    {4, 5, 6, 7} , // initializers for row indexed by 1 */
    {8, 9, 10, 11} // initializers for row indexed by 2
}
val := a[2][3]

```

<br>

```go
// Slice:    An array that can grow or shrink

// slices from array
myArray := [10]int{0,1,2,3,4,5,6,7,8,9}
mySlice1 := myArray[1:5] // [1 2 3 4]
mySlice2 := mySlice1[0:2] // [1 2]

// New slice
var letters = []string{“a”, “b”, “c”}
// OR -> make([]T, len, cap) []T
mySlice3 := make([]int, 4, 4) // [0 0 0 0]
mySlice4 := make([]int, 4) // is the same as mySlice3
mySlice5 := make([]int, 2, 4) // [0 0 nil nil]
len(mySlice5) // returns 2
cap(mySlice5) // returns 4

//Growing slices
a := []string{"a", "b", "c"}
b := []string{"x", "y", "z"}
// equivalent to "append(a, b[0], b[1], b[2])"
a = append(a,b...)

fmt.Printf("%d %v", cap(a), a) // 6 [a b c x y z]
```

## Byte Slice

```go
// Computer friendly representation of strings

// String to byte slice
greeting := "Hi there!"
fmt.Println([]byte(greeting))

// Byte slice to string
s := string([]byte{65, 66, 67})
fmt.Println(s) // ABC
```

See: [ASCII converter](http://www.unit-conversion.info/texttools/ascii/)

## Pointers

```go
&variable   // get the memory address
*pointer    // get the value
```

## Functions

```go
func greeting(name string) string {
    return "Hello " + name
}

func getSum(num1, num2 int) int {
    return num1 + num2
}
```

## Loops

```go
for i := 1; i <= 10; i++ {
    fmt.Printf("Number %d\n", i)
}

// Loop through a slice
cards := []string{'a', 'b'}

for i, card := range cards{
    fmt.Println(i, card)
}

for _, card := range cards{
    fmt.Println(card)
}
```

## Custom Type

```go
type deck []string

// Receiver Functions -> methods of a class
// Convention: Refer the receiver with 1 or 2 letter of abbrevation
func (d deck) print(){
      for i, card := range d {
        fmt.Println(i, card)
    }
}

func main() {
    cards := deck{"Ace of Diamonds"}
    cards.print()
}

```

## Maps

```go
// Python -> dictionary | Javascript -> Object
// Same key type & same value type
// Keys are indexed
// Reference type

// Declare
var colors map[string]string
colors := make(map[string]string)
colors := map[string]string{
    "red":   "#ff000",
    "green": "4bf745",
}

// Assign
colors["white"] = "#fffff"

// Delete
delete(colors, "red")

fmt.Println(colors["red"])

// Iterate over map
for color, hex := range colors {
    fmt.Println("Hex code for", color, "is", hex)
}
```

## Structs

```go
// Values can be of different type
// Need to know all the fields at compile time
// Keys don't support indexing
// Value type!

type person struct {
    firstName string
    lastName  string
    contact contactInfo
}

type contactInfo struct {
   email string
   zipCode int
}

// Receiver functions
func (p person) print() {
    fmt.Printf("%+v", p)
}

// Receiver functions
// - Need to pass in pointer to update the value (Struct is value type)
// - Note: *person is a type description not dereferencing
func (personPointer *person) updateFirstname(newFistName string){
	(*personPointer).firstName = newFirstName
}

func main() {
    // Declaring
    alex := person{"Alex", "Anderson"}
    me := person{firstName: "Alex", lastName: "Zhang"}
    var alex person	 // assign to zero values

    // Updating
    alex.firstName = "Alex"
    alex.lastName = "Zhang"

    // Embedded structs
    jim := person{
        firstName: "Jim",
        lastName: "Party",
        contact: contactInfo{
            email: "jim@gmail.com",
            zipCode: 94000,
        }
    }

    jimPointer := &jim
    jimPointer.updateFirstname("Jimmy")
    jim.print()
}

```

<br>

```go
func (personPointer *person) updateFirstname(newFistName string){
	(*personPointer).firstName = newFirstName
}

jimPointer := &jim
jimPointer.updateFirstname("Jimmy")

// Pointer shortcut
// Same as above
// highlight-range{1}
jim.updateFirstname("Jimmy")
```

## Ref types & value types

```bash
# Use pointers to change the value in a function
Value types:
    - int, float
    - string
    - bool
    - array
    - structs

# Don't worry about pointers with these
Reference types:
    - slices
    - maps
    - pointers
    - functions
```

## Interfaces

```go
// - Group same logic functions
// - A type satisfies an interface means that the type implements
//   all of the functions in the interface definition
// - We can't create a value directly out of an interface type,
//   only in concrete types (string, struct, customType, etc)

type bot interface {
	getGreeting() string
}

type englishBot struct{}
type spanishBot struct{}

func (englishBot) getGreeting() string {
	return "Hi there!"
}

func (spanishBot) getGreeting() string {
	return "Hola!"
}

func printGreeting(b bot) {
	fmt.Println(b.getGreeting())
}

func main() {
	eb := englishBot{}
	sb := spanishBot{}

	printGreeting(eb) // Hi, there!
	printGreeting(sb) // Hola!
}

```

## Routines

```bash
# - Go routines -> threads
# - By default, Go tries to use one core (Concurrency)
#
# - Concurrency:
#   we can have multiple threads executing code.
#   if one thread blocks, another one is picked up and worked on
#
# - Parallelism:
#   Multiple threads executed at the same time.
#   Requires multiple CPU cores
```

```go
func checkLink(link string) {
    _, err := http.Get(link)   // <- blocking call!
    if err != nil {
        fmt.Println(link + "migh be down")
        return
    }
    fmt.Println(link, "is up!")
}

func main() {
    links := []string{
        "https://google.com",
        "https://facebook.com",
        "https://golang.org",
        "https://amazon.com",
        "https://stackoverflow.com",
    }

    // It's not going to work as the main routine exits after the for loop
    // See channels
    for _, link := range links {
        // highlight-range{1}
        go checkLink(link)  // create a new thread (go routine)
    }

}
```

## Channels

```go
// The only way to communicate between routines
// channel <- 5            send the value '5' into this channel
// myNum <- channel        wait for a value and assign it to myNum
// fmt.Println(<-channel)  wait for a value and log it out immediately

func checkLink(link string, c chan string) {
    _, err := http.Get(link)
    if err != nil {
        fmt.Println(link + "migh be down")
        c <- "Might be down I think"
        return
    }
    fmt.Println(link, "is up!")
    c <- "Yep, its up"
}

func main() {
    links := []string{
        "http://google.com",
        "http://facebook.com",
        "http://golang.org",
        "http://amazon.com",
        "http://stackoverflow.com",
    }

    // highlight-range{1}
    c := make(chan string)  // create a string type channel

    for _, link := range links {
        go checkLink(link, c)
    }

	for i := 0; i< len(links);i++{
        // Will block the main routine before receiving a message
		fmt.Println(<-c)
	}
}


```
