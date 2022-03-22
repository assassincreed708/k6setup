# k6 Typescript Framework
Framework for k6 load tests written in TypeScript.

## Quick Start :zap:

1. Running without docker

- Install the [k6 performance test tool](https://docs.k6.io/docs/installation).

- Clone this repository and open in the IDE of your choice.

- Install dependencies using: 

`yarn install` 

in the terminal (you need to have [yarn](https://yarnpkg.com/getting-started/install) installed on your machine).

- Now run the test using the following command: 

`yarn go:cn_dev_mobileapi` 

This will run the test for mobileAPI using 1 VUser **k6**.

2. Running using docker

- Ensure you have [docker](https://www.docker.com/products/docker-desktop) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine.

- Start the monitors using the following command: 

`yarn monitors` 

- Go to **localhost:3000** in your browser to login to Grafana with the username '**admin**' and the password '**admin**'.


- Now run the test using the following command: 

`yarn go:docker` 

This will run the test for mobileAPI using 1 VUser **k6**.


# Folder structure

### **src** folder

All the code can be found in the `src` folder. And is written in TypeScript using [types provided by k6](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/k6).

### **lib** folder

This folder contains bespoke `types` and helper functions. It's highly recommended that you unit test your helper functions (e.g. with [Jest](https://jestjs.io/)). However I've not done that here, just to keep things simple.


### **actions** folder

The `actions` folder contains a script file for each user action. Each script file contains the requests that are sent when a user performs that particular action (e.g. login). The `roles` folder (inside the `actions` folder) contains a file for each user type and the actions they can perform.


### **tests** folder

This is where you create your performance tests using the modules from the rest of the framework.

## Checking your Code

Use: 

`yarn check-types` 

to check your code against type safety and the rules set in your [tsconfig.json file](tsconfig.json). You can also have this running while you work using: 

`yarn check-types:watch`.

## Building your Code

[Babel](https://babeljs.io/) handles the transpiling of the code (see the [.babelrc](.babelrc) file in the root directory), while [Webpack](https://webpack.js.org/) builds it (see the [webpack.config.js](webpack.config.js) file in the root directory).