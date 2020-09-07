const Telegraf = require('telegraf')
const config = require('./config.json')

const Koa = require('koa')
const koaBody = require('koa-body')

require('https').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
  res.end('')
})

const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const fs = require('fs')
const bot = new Telegraf(config.token)

bot.command('start', async (ctx) => {
  console.log(`Пользователь ${ctx.message.from.first_name} ${ctx.message.from.last_name} @${ctx.message.from.username} запустил бота`)
  await ctx.replyWithHTML(`Привет,  <b>${ctx.message.from.first_name} ${ctx.message.from.last_name}</b>`)
  await ctx.reply('Нажмите /menu, чтобы открыть меню')
  await ctx.reply('Что случилось?', Markup
    .keyboard([
      ['Сердце', 'Потеря сознания'], // Row1 with 2 buttons
      ['Перелом', 'Кровотечение'],
      ['Ожог', 'Подавился']
    ])
    .oneTime() // на 1 разработке
    .resize()
    .extra()
  )
})

bot.command('menu', ({ reply }) => {
  return reply('Меню', Markup
    .keyboard([
      ['Сердце', 'Обморок'], // Row1 with 2 buttons
      ['Перелом', 'Кровотечение'],
      ['Ожог', 'Без сознания']
    ])
    .oneTime() // на 1 разработке
    .resize()
    .extra()
  )
})

bot.command('help', async (ctx) => {
  await ctx.reply('Если у вас есть замечания или предложения, пожалуйста, напишите мне 🙏'),
  await bot.telegram.sendContact(ctx.message.chatId, '+79911142131','Nikita')
})

bot.hears('Ожог', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать при ожоге</b>

🔸  Устранить поражающий фактор

🔸  Охладить место проточной воды

🔸  Закрыть ожог влажной повязкой (менять ее чаще)

🔸  Принять обезболивающее

🔸  Обеспечить покой`);

  await ctx.replyWithHTML(`<b>Что нельзя делать при ожоге</b>

🔸  Наносить мази, крема, масло и тд.

🔸  Отрывать прилипшую одежду (при сильных ожогах)

🔸  Прокалывать пузыри

🔸  Накладывать лед/снег прямо на ожог`,
  Markup.inlineKeyboard([
    Markup.callbackButton('Химический ожог', 'Химический ожог'),
  ]).extra()
)})

bot.hears('Кровотечение', async (ctx) => {
  await ctx.replyWithHTML(`<b>Артериальное кровотечение</b>

🔸  Имеет ярко алый цвет и течет пульсируя

<b>Венозное кровотечение</b>

🔸  Имеет более темный цвет и не пульсирует`,
  Markup.inlineKeyboard([
    Markup.callbackButton('Артериальное', 'Артериальное'),
    Markup.callbackButton('Венозное', 'Венозное')
  ]).extra()
)})

bot.hears('Потеря сознания', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать</b>

🔸  Уложить человека на спину, на ровную поверхность, не дать упасть и удариться

🔸  Повернуть голову на бок

🔸  Поднять ноги выше головы

🔸  Расстегнуть тесную одежду

🔸  Обеспечить приток свежего прохладного воздуха`)

  await ctx.replyWithHTML(`<b>Что нельзя делать</b>

🔸  Усаживать или стараться поднять падающего человека

🔸  Хлопать по лицу (лучше растереть уши)

🔸  Давать нюхать нашатырный спирт, если сознание уже утрачено`)

  await ctx.replyWithHTML(`Если у человека наблюдается <b>остановка дыхания и пульса</b>, то следует приступить к выполнению сердечно-легочной реанимации

🔸  Человек должен лежать на ровной и твердой поверхности

🔸  Реанимация продолжается до восстановления дыхания и сердечной деятельности или до приезда скорой помощи`,
  Markup.inlineKeyboard([
    Markup.urlButton('Как проводить СЛР', 'https://www.youtube.com/watch?v=Zvrr7ScoZQ4')
  ]).extra()
  )
})

bot.hears('Перелом', async (ctx) => {
  await ctx.replyWithHTML(`<b>Симптомы перелома</b>

🔸  Сильная боль в месте травмы

🔸  Деформация конечности

🔸  Неестественное положение конечности

🔸  Отек, кровоизлияние`)

  await ctx.replyWithHTML(`<b>Что нужно делать при переломе</b>

🔸  Если человек находится без признаков жизни – принять меры по реанимации (провести СЛР) и только потом следовать далее

🔸  Если имеется кровотечение – остановить его и только потом следовать далее

🔸  Не менять положение тела и конечностей пострадавшего (если нужно снять одежду или обувь – делать это аккуратно, начиная со здоровой конечности)

🔸  Дать обезболивающее, приложить к месту травмы холодный компресс

🔸  Зафикстировать конечность`,
  Markup.inlineKeyboard([
    [Markup.urlButton('Как проводить СЛР', 'https://www.youtube.com/watch?v=Zvrr7ScoZQ4')],
    [Markup.callbackButton('Кровотечение','Кровотечение' )],
    [Markup.callbackButton('Как зафикстировать конечность', 'Как зафикстировать конечность')]
  ]).extra()
)
})

bot.hears('Сердце', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать при боли в сердце</b>

🔸  Посадить в кресло с подлокотниками или положить, приподняв голову

🔸  Освободить шею, обеспечить поступление свежего прохладного воздуха

🔸  Дать успокоительное средство (пустырник, валериану)

🔸  Поддерживать тишишу в помещении, не давать возможности нервничать больному человеку

<b>Если у человека есть признаки инфаркта ОБЯЗАТЕЛЬНО сообщите диспетчеру скорой помощи</b>`,
  Markup.inlineKeyboard([
    Markup.callbackButton('Симптомы сердечного приступа', 'Симптомы сердечного приступа')
  ]).extra())
})

bot.hears('Подавился', async (ctx) => {
  await ctx.replyWithHTML(`<b>Частичная непроходимость</b>

🔸  Человек в состоянии отвечать голосом на ваши вопросы, он может кашлять

<b>Полная непроходимость</b>

🔸  Человек не может говорить и кашлять`,
  Markup.inlineKeyboard([
    Markup.callbackButton('Частичная', 'Частичная'),
    Markup.callbackButton('Полная', 'Полная')
  ]).extra())
})

bot.hears('Привет', ctx => {
  ctx.reply('Привет');
  ctx.reply('👋')
})
bot.hears('Пока', ctx => {
  ctx.reply('Пока');
  ctx.reply('👋')
})

bot.hears('Меню', ({ reply }) => {
  return reply('Меню', Markup
    .keyboard([
      ['Сердце', 'Обморок'], // Row1 with 2 buttons
      ['Перелом', 'Кровотечение'],
      ['Ожог', 'Без сознания']
    ])
    .oneTime() // на 1 разработке
    .resize()
    .extra()
  )
})

bot.action('Меню', ({ reply }) => {
  return reply('Меню', Markup
    .keyboard([
      ['Сердце', 'Обморок'], // Row1 with 2 buttons
      ['Перелом', 'Кровотечение'],
      ['Ожог', 'Без сознания']
    ])
    .oneTime() // на 1 разработке
    .resize()
    .extra()
  )
})

bot.action('Позвонить', async (ctx) => {
  await ctx.replyWithHTML(`<a href="tel:112">112</a>`)
})

bot.action('Полная', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать при полной непроходимости</b>

🔸  Встать сбоку, немного позади пострадавшего

🔸  Поддерживать грудь пострадавшего одной рукой и достаточно сильно наклонить его вперед

🔸  Произвести 5 резких ударов между лопатками пострадавшего

🔸  Делайте это основанием ладони вашей свободной руки`,
  Markup.inlineKeyboard([
      Markup.callbackButton('Позвонить', 'Позвонить'),
      Markup.callbackButton('Меню', 'Меню')
  ]).extra())
})

bot.action('Частичная', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать при частичной непроходимости</b>

🔸  Находиться рядом с человеком. Следить за его состоянием

🔸  Дать пострадавшему прокашляться (<b>это самое эффективное</b>)

🔸  Успокоить подавившегося`,
  Markup.inlineKeyboard([
      Markup.callbackButton('Позвонить', 'Позвонить'),
      Markup.callbackButton('Меню', 'Меню')
  ]).extra())
})

bot.action('Как зафикстировать конечность', async (ctx) => { await ctx.replyWithPhoto('https://fireman.club/wp-content/uploads/2018/09/Pravila-nalozheniya-shinyi-pri-perelome.jpg')})

bot.action('Симптомы сердечного приступа',  async (ctx) => {
  await ctx.replyWithHTML(`<b>Симптомы сердечного приступа (инфаркта):</b>

🔸  Внезапно (приступообразно) возникающие давящие, сжимающие, жгущие, ломящие боли в грудной клетке (за грудиной), продолжающиеся более 5 минут

🔸  Аналогичные боли часто наблюдаются в области левого плеча (предплечья), левой лопатки, левой половины шеи и нижней челюсти, обоих плеч, обеих рук, нижней части грудины вместе с верхней частью живота

🔸  Нехватка воздуха, одышка, резкая слабость, холодный пот, тошнота часто возникают вместе, иногда следуют за или предшествуют дискомфорту/боли в грудной клетке

🔸  Нередко указанные проявления болезни развиваются на фоне физической или психоэмоциональной нагрузки, но чаще с некоторым интервалом после них`)

  await ctx.replyWithHTML(`<b>Нехарактерные признаки:</b>

🔸  Колющие, режущие, пульсирующие, сверлящие, постоянные ноющие в течение многих часов и не меняющие своей интенсивности боли в области сердца или в конкретной четко очерченной области грудной клетки`,
  Markup.inlineKeyboard([
      Markup.callbackButton('Позвонить', 'Позвонить'),
      Markup.callbackButton('Меню', 'Меню')
  ]).extra())
})

bot.action('Химический ожог', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать при химическом ожоге</b>

🔸  Промывать место поражения в течение 20 минут

🔸  Нейтрализовать химикаты.

🔹  <b>При ожоге кислотой</b>: посыпать содой или промыть мыльной водой

🔹  <b>При ожоге щелочью</b>: промыть разбавленной уксусной кислотой

🔸  Сделать повязку стерильным бинтом/тканью`)

  await ctx.replyWithHTML(`<b>Что нельзя делать при химическом ожоге</b>

🔸  Прикасаться к области поражения

🔸  Прикладывать компресс`,
  Markup.inlineKeyboard([
      Markup.callbackButton('Позвонить', 'Позвонить'),
      Markup.callbackButton('Меню', 'Меню')
  ]).extra())
})

bot.action('Артериальное', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать при артериальном кровотечении</b>

🔸  Нажать большим пальцем руки на артерию выше раны (нужно остановить или ослабить кровотечение)

🔸  Наложить резиновый или самодельный жгут (ремень, шнур и тд) <b>на артерию выше раны</b>

🔸  Оставить записку c указанием времени наложения жгута

🔸  Перевязать рану`)

  await ctx.replyWithHTML(`<b>Что нельзя делать при артериальном кровотечении</b>

🔸  Оставлять жгут на более, чем 2 часа после его наложения, иначе может наступить омертвление тканей`,
  Markup.inlineKeyboard([
      Markup.callbackButton('Позвонить', 'Позвонить'),
      Markup.callbackButton('Меню', 'Меню')
  ]).extra())
})

bot.action('Венозное', async (ctx) => {
  await ctx.replyWithHTML(`<b>Что нужно делать при венозном кровотечении</b>

🔸  Поднять поврежденную конечность вверх

🔸  Наложить на рану давящую повязку (при сильном кровотечении выше раны наложить жгут)`);

  await ctx.replyWithHTML(`<b>Что нельзя делать при венозном кровотечении</b>

🔸  Пытаться промыть рану или извлечь из нее мелкие предметы (осколки стекла и тд.)

🔸  Пытаться удалить сгустки крови и тромбы (может открыться кровотечение)`,
  Markup.inlineKeyboard([
      Markup.callbackButton('Позвонить', 'Позвонить'),
      Markup.callbackButton('Меню', 'Меню')
  ]).extra())
})

bot.action('Кровотечение', async (ctx) => {
  await ctx.replyWithHTML(`<b>Артериальное кровотечение</b>

🔸  Имеет ярко алый цвет и течет пульсируя

<b>Венозное кровотечение</b>

🔸  Имеет более темный цвет и не пульсирует`,
  Markup.inlineKeyboard([
    Markup.callbackButton('Артериальное', 'Артериальное'),
    Markup.callbackButton('Венозное', 'Венозное'),
  ]).extra()
)})

bot.action('Как зафикстировать конечность', async (ctx) => { await ctx.replyWithPhoto({ source: fs.createReadStream('https://fireman.club/wp-content/uploads/2018/09/Pravila-nalozheniya-shinyi-pri-perelome.jpg') })})

bot.launch()

bot.telegram.setWebhook('https://git.heroku.com/f-a-t-bot.git/secret-path')

const app = new Koa()
app.use(koaBody())
app.use((ctx, next) => ctx.method === 'POST' || ctx.url === '/secret-path'
  ? bot.handleUpdate(ctx.request.body, ctx.response)
  : next()
)
app.listen(3000)

