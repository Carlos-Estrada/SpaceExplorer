.PHONY: build run clean

build:
    go build -o space-explorer

run: build
    ./space-explorer

clean:
    rm -f space-explorer
