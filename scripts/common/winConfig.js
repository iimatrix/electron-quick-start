if (process.platform === 'darwin') module.exports = {}
else module.exports = {
  icon: process.env.winIcon,
  target: [
    {
      target: "nsis",
      arch: ["ia32"],
    },
  ],
  sign: async (config) => {
    // 应用签名逻辑
  }
}