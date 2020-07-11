const {globalShortcut, shell} = require('electron')
const appUtil = require('../app-util')
const appToast = require('../app-toast')
const fs = require('fs')
const Path = require('path')
const OS = require('os')
const configPath = `${OS.homedir()}/BlogHelper/ShortcutKey.json`
const helpFile = Path.join(__dirname, 'help.md')

function initConfigFile() {
    if (!fs.existsSync(configPath)) {
        if (!fs.existsSync(Path.dirname(configPath))) {
            fs.mkdirSync(Path.dirname(configPath))
        }
        fs.writeFileSync(configPath, fs.readFileSync(`${__dirname}/config.json`))
    }
}

function loadShortcutKey(menu) {
    // 初始化配置文件
    initConfigFile()
    // 卸载全部注册的快捷键
    globalShortcut.unregisterAll()
    // 注册快捷键
    fs.readFile(configPath, {encoding: "utf8"}, (err, data) => {
        if (err) {
            return console.error(err)
        }
        const params = JSON.parse(data)
        for (const param of params) {
            if (param.switch) {
                globalShortcut.register(param.accelerator, () => {
                    const button = appUtil.myGetMenuItemByLabelPath(param.name.toString().split('-'), menu);
                    if (button) {
                        button.click()
                    } else {
                        appToast.toast({title: "找不到快捷键对应的菜单"})
                    }
                })
            }
        }
    })
}

function openConfigFile() {
    shell.openItem(configPath)
}

function openHelpFile() {
    shell.openItem(helpFile)
}

exports.openHelpFile = openHelpFile
exports.openConfigFile = openConfigFile
exports.loadShortcutKey = loadShortcutKey