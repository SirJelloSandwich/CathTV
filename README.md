# Beyond Today

## Getting Started

This project depends on the NodeJS Package Manager, npm, for handling dependencies. It also depends on Sass for preprocessing scss files into css.

### On Mac OS X

#### npm

Install [Homebrew](http://brew.sh) by running the following command:

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

#### Sass

Sass is distributed as a Ruby gem. OS X comes with Ruby preinstalled, so in order to get Sass, all you need to execute is:

```sh
gem install sass
```

### On Linux systems

The following is written with direct regard to Debian-based distributions, including the Ubuntu family. For other distros, swap out the proper package manager or refer to the Arch wiki for how to build dependencies.

#### npm

Install via your operating system's package manager. Note that, due to some ongoing drama regarding naming conventions by package maintainers, NodeJS requires a slight workaround on Debian-based distributions.

```sh
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install nodejs
```

#### sass

First, check to see if Ruby is installed:

```sh
which ruby && ruby -v
```

If Ruby isn't found, or it's below version `1.9.3`, take a look into [rvm](https://rvm.io). I recommend running `Ruby 2.2.0+.`

## Developing

### Gathering project dependencies

Once you have NodeJS and npm installed, and this project downloaded, you can now gather the necessary dependencies:

```sh
cd flicast-core-html5
npm install
```

Note that `npm install` reads dependencies from `package.json`.

In the simplest terms, the tilde matches the most recent minor version (the middle number). ~1.2.3 will match all 1.2.x versions but will miss 1.3.0.
The caret, on the other hand, is more relaxed. It will update you to the most recent major version (the first number). ^1.2.3 will match any 1.x.x release including 1.3.0, but will hold off on 2.0.0.

To add another package while developing, please use:

```sh
npm install --save-dev {package}
```

### Project structure

The project is structured as follows:

    flicast-core-html5 :
    - Gruntfile.js   # defines grunt tasks for building, packaging, etc
    - package.json   # holds npm dependencies and project information
    - docs/          # contains useful documentation about structure of project
    - spec/          # holds unit and integration tests, as ran by Jasmine
    - src/           # source code
        - assets/            # static assets such as images
        - html/
        - js/
        - libs/              # javascript libraries
        - scss/
        - tizenspecific/     # files necessary for building on the Tizen platform

All code changes should be made within the `src/` directory.

## Deploying locally

Running your project locally is a four-step process.

1. Make sure you have all the necessary dependencies for building: `npm install`

2. Build your project locally: `grunt dev`

3. In another terminal, launch your development server: `npm start`

4. In your favorite Chromium-based browser, navigate to [http://localhost:3000/dev](http://localhost:3000/dev).

   *Note: If this URL does not work for you, first make sure your server is running. You may also need to consult your `/etc/hosts` system configuration file to make sure `localhost` is properly configured.*


#### What's happening here?

Development builds do two primary things: concatenate local JavaScript files into one file, and sends all Sass files through the preprocessor to generate CSS. You will also notice that this process halts on `Running "watch" task` -- that's because it will automatically re-wrangle and lint any modified SCSS and JavaScript files *as you edit them.*

This process will also copy all modifications to your live development build, allowing you to catch syntax (or style) errors in real time while simultaneously viewing the result in a browser.

I recommend keeping this process running, and as you make changes, you'll be warned if any syntax errors are caught -- further, `grunt` will automatically reprocess any changed JavaScript or Sass files for you.


## Deploying to FireTV

In order to view the packaged version of this application on FireTV:

1. Ensure you have all necessary dependencies for building: `npm install`

2. Create a deployable package of the project's current state: `grunt package`

3. Find your current LAN IP address: `ifconfig | grep "inet" | grep -v 127.0.0.1`

    *Note: A proper IPv4 address will look like XXX.XXX.XXX.XXX.*

4. Launch your local server: `npm start`

5. On your Fire TV device, navigate to the packaged application in the Amazon Web App Tester application: `http://{Your computer's LAN IP}:3000/fli.zip`

    *Note: Make sure you clear your browser cache and refresh the application bundle before deploying.*


#### What's happening here?

Production builds achieve a couple of things. First and foremost, JavaScript and preprocessed Sass files are concateneated and minified to minimize filesize (and thus transfer time). Further, depending on your platform, certain dependencies will be automatically included. At this point in time, there's only Tizen-specific files needed for some operations, but this will likely change down the line.
