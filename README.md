## Beanmaster

Nodejs [Beanstalkd](http://kr.github.io/beanstalkd/) admin console, inspired by [PHP version](https://github.com/ptrofimov/beanstalk_console) written by [ptrofimov](https://github.com/ptrofimov)

Rewritten in Nodejs with ExpressJS, with some improvements

### Installation

```
npm install -g beanmaster
```

### Usage

You can simply start the server and listening 3000 with:

```
beanmaster
```

Use `-p` or `--port` to specify port number:

```
beanmaster -p 4000
```

You may start as daemon server:

```
beanmaster start
```

Stop the server daemon:

```
beanmaster stop
```

Restart the server daemon:

```
beanmaster restart
```

See all options:

```
beanmaster --help
```

### Todo / Known issue

1. Disconnect beanstalkd connection
2. Multiple viewer may cause unexpected result as several actions require async operation.

  a. User 1 tries to add a new job to tube A

  b. The connection used tube A
  
  c. Before connection put the job to the tube A, User 2 tries to add a new job to tube B
  
  d. The connection used tube B
  
  e. User 1's job added to tube B

  This may be solved by initiating connections for each users

### Change Logs

Please refer to CHANGELOG.md

### Acknowledgement

Original design: [ptrofimov](https://github.com/ptrofimov)
