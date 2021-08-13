# Sarif-viewer
Small tool that can be used to view sarif files in a user friendly way.

## Installation
```
$ npx sarif-viewer@latest
```
## Usage
Simply open http://localhost:8080 on your browser.

## Demo
There is currently a demo running under https://sarif-viewer.herokuapp.com/

## Gitlab integration example
You can create issues under your project in gitlab through the vulnerability details window.
```
$ gitlab_enabled=true
$ gitlab_api=https://gitlab.com/api/v4
$ gitlab_url=https://gitlab.com/
$ gitlab_access_token=YOUR_ACCESS_TOKEN
$ gitlab_project_id=YOUR_PROJECT_PATH
```

## TODO
- Validate user input on results filter