const Telegraf = require('telegraf')
const { memorySession, Extra, Markup } = require('telegraf')
var rp = require('request-promise');
require('dotenv').config();


// import * as miCiudad from "apiMiCiudad";
const miCiudad = require('./apiMiCiudad')


console.log("*"+process.env.BOT_TOKEN+"*")
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(memorySession())
bot.use(Telegraf.log())

var options = {
  uri: 'https://www.miciudad.org.py/api/v1/node.json?parameters[type]=propuesta,reporte,evento',
  // qs: {
  //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
  // },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

var individual = {
  // uri: 'https://www.miciudad.org.py/api/v1/node.json?parameters[type]=propuesta,reporte,evento&fields=title,type',
  // qs: {
  //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
  // },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

bot.command('login', (ctx) => {
  if(ctx.session.drupal !== undefined){
    ctx.reply('Uh!! Usuario ya esta logueado!');
  }
  else{
    var client = miCiudad.createClient();
    var comando = ctx.message.text.split(" ")
    var user = comando[1]
    var password = comando[2]
    console.log("Login: user:"+user + " pass:" + password)
    try {
      client.login(user, password)
      .then(function(algo) {
        console.log("drupal._cookie:" + client._cookie + " | drupal._csrfToken:" + client._csrfToken);
        if(client._cookie){
          ctx.session.drupal = client;
          ctx.reply('Nombre de usuario ' + algo.user.name)
        }
      })
      .error( err => {
        console.error("Hubo un error jaimito! "+ JSON.stringify(err));
      });
    } catch (e) {
      console.error(e);
    } finally {

    }

  }

})

bot.command('logout', (ctx) => {
  if(ctx.session.drupal == undefined){
    ctx.reply('Desea cerrar sesión pero no hay una sesión iniciada!');
  }
  ctx.session = null;
})


bot.command('listar', (ctx) => {
  // console.log('1 2 3 entrando');
  let MAX_NODES = 2;
  rp(options)
  .then(function (nodes) {

    filtrados = nodes.slice(0,MAX_NODES);//filter(n=>{n.type == "evento"}) //
    console.log(filtrados.length)
    // console.log("@@@@@@@@@@@@@@@@@")

    filtrados.map(nodo => {

      individual.uri = nodo.uri + ".json" //{uri:nodo.uri+".json"}
      // console.log("-------------------")
      // console.log("!!!!!!!>"+JSON.stringify(nodo)+ ":::uri?" + nodo +"<!!!!!!!")
      rp(individual)
      .then(datos => {
        // console.log("-------------------")
        // console.log(">>>>"+datos+"<<<<")
        let lat = datos.field_geo_ubicacion.und[0].lat;
        let lon = datos.field_geo_ubicacion.und[0].lon;
        // console.log(`Punto(${lat},${lon})`);
        ctx.replyWithMarkdown(`*${datos.title}*
          ${JSON.stringify(datos.body.und[0].value)}
          Creado el *${datos.created}*
          [Uri](${datos.uri})
          Punto(${lat},${lon})
          `);
          ctx.replyWithLocation(lat, lon);
        })
        // .catch(err=>{console.error(err)});
      })


      // console.log('User has %d repos', repos.length);
    })
    .catch(function (err) {
      // API call failed...
      console.log('Algo estuvo mal!');
      console.log(err);
    });
})


bot.command('crearevento', (ctx) => {

  if(ctx.session.drupal == undefined){
    ctx.reply('Uh!! Debes estar logueado!');
    return;
  }else{
    miCiudad.crearEvento(ctx.session.drupal);
  }
  return ctx.reply('One time keyboard', Markup
  .keyboard([
    '/simple',
    '/inline',
    '/pyramid'
  ])
  .oneTime()
  .resize()
  .extra()
)
})

bot.command('custom', (ctx) => {
  return ctx.reply('Custom buttons keyboard', Markup
  .keyboard([
    ['🔍 Search', '😎 Popular'], // Row1 with 2 button
    ['☸ Setting', '📞 Feedback'], // Row2 with 2 button
    ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 button
  ])
  .oneTime()
  .resize()
  .extra()
)
})

bot.command('special', (ctx) => {
  return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
    return markup.resize()
    .keyboard([
      markup.contactRequestButton('Send contact'),
      markup.locationRequestButton('Send location')
    ])
  }))
})

bot.command('pyramid', (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
    })
  ))
})

bot.command('simple', (ctx) => {
  return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
    Markup.keyboard(['Coke', 'Pepsi'])
  ))
})

bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup(
    Markup.inlineKeyboard([
      Markup.callbackButton('Coke', 'Coke'),
      Markup.callbackButton('Pepsi', 'Pepsi')
    ])))
  })

  bot.command('random', (ctx) => {
    return ctx.reply('random example',
    Markup.inlineKeyboard([
      Markup.callbackButton('Coke', 'Coke'),
      Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
      Markup.callbackButton('Pepsi', 'Pepsi')
    ]).extra()
  )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
  return ctx.reply('Keyboard wrap', Extra.markup(
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      columns: parseInt(ctx.match[1])
    })
  ))
})

bot.action('Dr Pepper', (ctx, next) => {
  return ctx.reply('👍').then(next)
})

bot.action(/.+/, (ctx) => {
  return ctx.answerCallbackQuery(`Oh, ${ctx.match[0]}! Great choise`)
})

bot.startPolling()
