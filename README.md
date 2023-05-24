# xmmx

## Getting Started

### Prerequisites

- docker

### Installing

Pull repository

```bash
# with http
git clone --recursive https://github.com/ko0hi/xmmx.git

# with ssh
git clone --recursive git@github.com:ko0hi/xmmx.git
```

Place `apis.json` in the root directory.

```json
{
  "binanceusdm": {
    "apiKey": "xxx",
    "secret": "xxx"
  },
  "binancecoinm": {
    "apiKey": "yyy",
    "secret": "yyy"
  }
}
```

The keys are the names of [the exchanges in ccxt](https://docs.ccxt.com/#/ccxt.pro.manual?id=exchanges).
The values are the credentials for the exchange like `apiKey` and `secret` (`password` might be also required depending
on exchanges).

#### Docker environment
```bash
sh ./start.sh
```

You can access to XMMX with `http://localhost:3000`.

#### Local environment

Move to the ccxt-server directory and create `.env` file.

```bash
cd lib/ccxt-server
touch .env
```

And, write the following in `.env` file.

```
CCXT_SERVER_APIS=/PATH/TO/apis.json
```

Then, run the following command.

```bash
yarn && yarn start
```


Move back to the root directory with different terminal and run the following command.

```bash
yarn && yarn dev
```

You can access to XMMX with `http://localhost:3000`.


## Update your version with the latest commit

After pulling the latest commit in the main branch, run `update.sh` that just executes `docker-compose down && docker-compose build` inside.

```bash
sh ./update.sh
```

Then, restart the containers.

```bash
sh ./start.sh
```
