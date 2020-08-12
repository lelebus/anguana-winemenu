package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strings"
)

var csvDelimiter = ';'
var version string

var importFile string = "carte.csv"

func main() {
	fmt.Println("Parsing " + importFile)

	file, err := os.Open(importFile)
	if err != nil {
		fmt.Println(err)
	}

	var wines []string

	reader := csv.NewReader(bufio.NewReader(file))
	reader.Comma = csvDelimiter
	reader.Read() // read header line

	var currentListing bool = false
	for l := 0; ; l++ {
		line, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Println("Error occurred in reading import file :: ", err)
		}

		var carteline string
		if strings.HasPrefix(line[0], "#") {
			currentListing = false
			if strings.HasPrefix(line[0], "##") {
				// subtitle
				carteline = "### " + line[1]
			} else {
				// title
				carteline = "## " + line[1]
			}
		} else {
			if !currentListing {
				wines = append(wines, "  |  |  |  |  |  ")
				wines = append(wines, " --- | --- | --- | --- | --- | --- ")
				currentListing = true
			}
			carteline = "*" + line[0] + "* | " + line[1] + " | " + line[2] + " | " + line[3] + " | " + line[4] + " | € " + line[6]
		}

		wines = append(wines, carteline)

	}

	file, err = os.Create("finalcarte.txt")
	writer := csv.NewWriter(file)
	for _, w := range wines {
		fmt.Fprintln(file, w)
	}
	writer.Flush()
}
