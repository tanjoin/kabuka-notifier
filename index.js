var Nightmare = require('nightmare');
var nightmare = Nightmare({
    show: false
});
var notifier = require('node-notifier');
var CronJob = require('cron').CronJob;

var path = 'http://stocks.finance.yahoo.co.jp/stocks/detail/?code=998407.o';
var title = '日経平均株価';
var price = '';

var main = function() {
    nightmare
        .goto(path)
        .wait('table.stocksTable > tbody > tr > td.stoksPrice:nth-of-type(2)')
        .evaluate(function() {
            return document.getElementsByClassName("stoksPrice")[1].innerText;
        })
        .then(function(result) {
            if (price !== result) {
                notifier.notify({
                    'title': title,
                    'message': result,
                    'icon': 'res/graph10_oresen1.png',
                    'open': path,
                    'sound': true
                });
            }
            console.log(result);
        })
        .catch(function(error) {
            console.log(error);
            errorNotify();
            job.stop();
        });
};

var errorNotify = function() {
    notifier.notify({
        'title': title,
        'message': 'エラーが発生したため通知を終了します',
        'icon': 'res/graph10_oresen1.png',
        'open': path,
        'sound': true
    });
};

main();
var job = new CronJob({
    cronTime: '*/5 * * * *',
    onTick: main,
    start: false,
    timeZone: 'Asia/Tokyo'
});
job.start();
