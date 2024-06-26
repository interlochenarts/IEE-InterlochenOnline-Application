# IEE-InterlochenOnline-Application

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

`ng build --configuration production --aot --output-hashing=none`

`--configuration production` sets the build into production mode, which strips out all dev libraries.

`--aot` changes the build mode to 'ahead of time' so more compilation happens before the JIT compiler on the browser gets reached.

`--output-hashing=none` makes the file names not have any hashed character sequences, so we can refer to
them nicely in the static resource bundles.

## Uploading to SalesForce

`./compressBuild.sh` compresses the build and creates a .resource file to be uploaded to SalesForce

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
