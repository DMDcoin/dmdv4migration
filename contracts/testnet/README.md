




## Creating Test Signatures

get a address:

```
diamond-cli getnewaddress "1"
dYHX6skSoCBDBYm99b6542y5cDbAnCkM3m
```

get a signature:
```
diamond-cli signmessage "dYHX6skSoCBDBYm99b6542y5cDbAnCkM3m" "claim 0x43B79745bdB4dA8449f28Caf1a8a5E5661949518"
HzJQpOG1Q/N70rJTvmUGKEemYeZe9ebboY/QPNNH63jiJDy3M98FCuZH+FoAp4Ieuru68lbu15D99aG9pmEgntE=
```

verify a message:
```
diamond-cli verifymessage dYHX6skSoCBDBYm99b6542y5cDbAnCkM3m HzJQpOG1Q/N70rJTvmUGKEemYeZe9ebboY/QPNNH63jiJDy3M98FCuZH+FoAp4Ieuru68lbu15D99aG9pmEgntE= "claim 0x43B79745bdB4dA8449f28Caf1a8a5E5661949518"
```


