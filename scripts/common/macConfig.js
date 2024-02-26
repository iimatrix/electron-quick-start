if (process.platform != 'darwin') module.exports = {}
else module.exports = {
  "icon": process.env.macIcon,
  "type": "distribution",
  "identity": "Apple Distribution: Hangzhou ****** System Technology Co., Ltd. (************)"
}