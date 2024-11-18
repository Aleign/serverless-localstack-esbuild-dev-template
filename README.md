# Serverless-Localstack-Esbuild Boilerplate

A development environment template for TypeScript-based Serverless v4+ applications running on Localstack. Features hot-reloading, debugging support, and optimized builds with esbuild.

## Features
- TypeScript support with esbuild
- Local development with Localstack
- Integrated debugging with VSCode
- Hot reload capability
- Build optimization and analysis
- Docker-based development environment
- Localstack pro image for websocket support, you can just change this in the docker-compose.yaml

## Table of Contents
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Development Commands](#development-commands)
- [Build System](#build-system)
- [Debugging Guide](#debugging-guide)
- [Architecture](#architecture)
- [Localstack Data](#localstack-data)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Quick Start
1. Clone the repository
2. set you localstack auth token in docker-compose.yaml
3. Install dependencies: `yarn install`
4. Start development environment: `yarn start`
5. For debugging: `yarn debug`

This will build the basic http and websocket handlers so you can see it in action and test debugging etc

## Prerequisites
- Node.js v20+
- Yarn package manager
- Docker and Docker Compose
- VSCode (recommended for debugging)

## Development Commands

### `yarn start`
Builds and deploys to Localstack without debugging enabled. Ideal for frontend developers and rapid development.

### `yarn debug`
Deploys with debugging enabled. Compatible with VSCode debugger attachment. Use the "Start Local Deployed Debug Environment" task for the best experience.

### `yarn build`
Runs typechecking and esbuild configuration. Generates build reports in the esbuild-meta directory.

### `yarn watch`
Enables hot-reloading during development.

## Build System

### Build Optimization
- Package externalization options for troubleshooting
- Build size analysis and visualization
- Automatic node_modules cleanup (40%+ size reduction)

### Build Reports
Located in `esbuild-meta`:
- Size summaries
- Detailed breakdown
- Dependency graphs
- Historical comparisons (last 2 builds)

## Debugging Guide

### VSCode Configuration
1. Enable Auto Attach
2. Use provided debug tasks
3. Configure debug ports in `debug_config.yaml`

### Debug Mode Features
- Hot reload support
- Individual handler debugging
- Automatic port management
- Build watching

### Known Limitations
- Single instance per handler in debug mode
- Limited concurrent request handling
- VSCode-specific debugging optimizations

### Debug Port Conflicts
Edit debug_config.yaml to assign unique ports per handler.

### Node Version Mismatches
Configure VSCode tasks to use the correct Node binary:
{
    "command": "/path/to/your/node",
    "args": ["yarn", "_debug"]
}

## Architecture
project/
├── .localstack_data/ # Mounted Localstack data
├── lambda-mount/ # Hot reload directory
├── scripts/ # Utility scripts
├── src/ # Source code
└── esbuild-meta/ # Build reports


## Localstack Data
- Mounted at `.localstack_data`
- Accessible local stack state
- Easy data inspection

## mountCode point

mountCode mounts ./ which causes the hot relaod to go mental when stuff inside ./localstack_data is changing.

It would be good if you could pass a proper mount config to mountCode so that you can then exclude directories

eg

would mount agnularApp, but exclude node_modules from the host
volumes:
- './angularApp:/opt/app'
- /opt/app/node_modules/

The use case here is in fact mounting the locastack volume inside the local repo for easy accesss to the data in localstack


eg
` localstack volumes
volumes:
- "${LOCALSTACK_VOLUME_DIR:-./.localstack_data}:/var/lib/localstack"

We've worked around it for now by mounting ./lambda-mount at mountCode. but it means you then need to copy .serverless/build to ./lambda-mount. This is all handled in the servreless.sh script so no biggy, but feels like it could be better

It was decided to do this rather than use .serverless directory directly as .serverless is used for other deployment stages etc and things could end up getting messy


## Additional Info
### debuggers and tasks

if you have run any local yarn commands in termianl on macos and you try and run the local debugger environment you might get

errros like not compiled for same version or somehting when running debuggers or tasks and you're on mac os and trying to run local builds

you need to ensure they run as the same node process

eg, this is pointing to node install as arm64 and not x64 which is what the temrinal runs

you need to adjust the Local Debug task to point to your node version otherwise vscode will just use the globally installed node

{
	"label": "Start Local Debug Environment",
	"type": "process",
	"command": "/Users/fridaystreet/.nvm/versions/node/v20.18.0/bin/node",
	"args": [
		"yarn",
		"_debug"
	],
	"options": {
		"cwd": "${workspaceRoot}"
	},
	"presentation": {
		"panel": "dedicated",
		"reveal": "always",
		"echo": false
	}
}

### MacOS Users
Set file descriptor limits:

sudo sysctl -w kern.maxfiles=200000
sudo sysctl -w kern.maxfilesperproc=200000


Ensure docker is not running before you execute these commands sometimes it goes crazy and crashes everything

### Other
There are a few other comments around the config files here and there that might help if your hitting any issues or want to know how to configure something

### Limitiations and known issues
Currently websocket sec-websocket-prtocol headers are not supported, but this should be fixed any day now. See github issue https://github.com/localstack/localstack/issues/6521


## Contributing
This is just a first release, we have nothing formal around the management of this at this stage. If you have any improvements please feel free to submit a PR or open an issue. Its currently a work in progress and we're happy to accept any feedback or suggestions.


## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).

You are free to:
- Use this boilerplate in commercial projects and products
- Share and adapt the boilerplate code
- Modify and build upon the material

Under the following terms:
- Attribution: You must give appropriate credit
- NonCommercial Distribution: You may not sell or redistribute this boilerplate itself as a product
