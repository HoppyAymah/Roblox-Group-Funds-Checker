const axios = require('axios')
const discord = require('discord.js')
var setTitle = require('console-title')
const noblox = require('noblox.js')
const CONFIG = require('./config.json')
var colors = require('colors')
const fs = require('fs')



let text = `
███████╗██╗░░░██╗███╗░░██╗██████╗░░██████╗░█████╗░██╗░░██╗███████╗░█████╗░██╗░░██╗███████╗██████╗░
██╔════╝██║░░░██║████╗░██║██╔══██╗██╔════╝██╔══██╗██║░░██║██╔════╝██╔══██╗██║░██╔╝██╔════╝██╔══██╗
█████╗░░██║░░░██║██╔██╗██║██║░░██║╚█████╗░██║░░╚═╝███████║█████╗░░██║░░╚═╝█████═╝░█████╗░░██████╔╝
██╔══╝░░██║░░░██║██║╚████║██║░░██║░╚═══██╗██║░░██╗██╔══██║██╔══╝░░██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
██║░░░░░╚██████╔╝██║░╚███║██████╔╝██████╔╝╚█████╔╝██║░░██║███████╗╚█████╔╝██║░╚██╗███████╗██║░░██║
╚═╝░░░░░░╚═════╝░╚═╝░░╚══╝╚═════╝░╚═════╝░░╚════╝░╚═╝░░╚═╝╚══════╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝`

console.log(colors.blue(text))
console.log(colors.blue("================================================================================================="))

const webhookClient = new discord.WebhookClient(CONFIG.WebhookID, CONFIG.WebhookToken)


let Count = 0
let Robux = 0


setTitle("Hoppy's Funds Checker || v1.0 || Total Groups Checked: "+Count+" || Total Robux Found: "+Robux)



async function getToken(){

  await noblox.setCookie(CONFIG.Cookie)
  let token = await noblox.getGeneralToken()

  let info = await axios({
      method: 'GET',
      url: 'https://www.roblox.com/mobileapi/userinfo',
      headers: { 
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token,
            "Cookie": `.ROBLOSECURITY=${CONFIG.Cookie}`
        }
      })
// getting the cookie info
  let userID = info.data.UserID
  let Current = 0

let AllGroups = await axios({
      method: 'GET',
      url: 'https://groups.roblox.com/v2/users/'+userID+'/groups/roles',
      headers: { 
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token,
            "Cookie": `.ROBLOSECURITY=${CONFIG.Cookie}`
        }
      })

   let length = AllGroups.data.data.length
// getting the list of all the cookie's Groups

 setInterval(() => {
if(Current < length - 1){
      axios({
      method: 'GET',
      url: 'https://economy.roblox.com/v1/groups/'+AllGroups.data.data[Current].group.id+'/currency',
      headers: { 
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token,
            "Cookie": `.ROBLOSECURITY=${CONFIG.Cookie}`
        }
      })
        .then(function (response) {
        console.log(colors.green(`[${AllGroups.data.data[Current].group.id}] Group with Over ${response.data.robux} Unpending Robux`))
        Robux += response.data.robux
      })
        .catch(function (error) {
         console.log(colors.red(`[${AllGroups.data.data[Current].group.id}] ${error.response.data.errors[0].message}`))
      })

Current++
Count++
setTitle("Hoppy's Funds Checker || v1.0 || Total Groups Checked: "+Count+" || Total Robux Found: "+Robux)
}else{
 let embed = new discord.MessageEmbed()
 .setTitle(`Hoppy's Unpending Checker`)
 .setThumbnail(info.data.ThumbnailUrl)
 .addField('TotalGroupsChecked', length)
 .addField('RobuxFound', Robux)
 .setColor('BLUE')
 .setFooter('Made by HoppyAymah')
 .setTimestamp()

 webhookClient.send({
	username: "Hoppy's Unpending Checker",
	avatarURL: 'https://media.discordapp.net/attachments/815679497361686568/840346093245169674/5123a3073853d8107bcc14a2ef3c273b.png',
	embeds: [embed],
   })
   .then(webhook => process.exit())
}
 }, 5000)
}

getToken()