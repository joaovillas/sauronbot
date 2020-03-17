require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const cheerio = require("cheerio");
const request = require("request");
bot.login(TOKEN);

function techMundoText(msg, link) {
  request(link, function(err, _, body) {
    if (err) {
      console.log(err, "eror ocurred while hitting url");
    }

    const $ = cheerio.load(body);
    
    const text = $('div.tec--article__body').text();
    console.log(text);
    msg.channel.send(`Notícia: \n${text}`);
    msg.channel.send(`Link para noticia: ${link}`)
  });
}

function techMundo(msg) {
  const url = `https://www.tecmundo.com.br/novidades`;
  request(url, function(err, _, body) {
    if (err) {
      console.log(err, "error occured while hitting url");
    }

    let $ = cheerio.load(body);
    msg.channel.send("############ Noticias do dia ##############");
    $(`div.tec--list__item`).each( async function(index) {
      const link = $(this)
        .find("a")
        .attr("href");
      await techMundoText(msg, link);
    });
  });
}


bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", msg => {
  if (msg.content.startsWith("!news")) {
    const command = msg.content.replace("!news", "").replace(" ", "");
    switch (command) {
      case "tech":
        techMundo(msg);
        break;
      default:
        msg.channel.send("Digite um tema | tech, world, dollar, bitcoin |");
    }
  }
});
