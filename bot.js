const newrelic = require('newrelic');
const http = require('http')
const twit = require('twit');
const CONFIG = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,  
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_KEY,  
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}
const CHARACTER_LOWER_LIMIT = 235
const CHARACTER_UPPER_LIMIT = 265
const INTERVAL = 60 * 60 * 1000
let UsingQuotes1 = true

const Twitter = new twit(CONFIG);

const quotes1 = [
    "If we left the EU, we would end this sterile debate, and we would have to recognise that most of our problems are not caused by “Bwussels” http://bit.ly/2NoyOuU",
    "This is a market on our doorstep, ready for further exploitation by British firms: the membership fee seems rather small for all that access http://bit.ly/2rcSWav",
    "Britain is a great nation, a global force for good. It is surely a boon for the world and for Europe that she should be intimately engaged in the EU http://bit.ly/2rcSWav",
    "If we get to this campaign, I would be well up for trying to make the positive case for some of the good things that have come from the single market http://bit.ly/2JTdeMM",
    "Leaving would cause at least some business uncertainty, while embroiling the Government for several years in a fiddly process of negotiating new arrangements, so diverting energy from the real problems of this country http://bit.ly/2JW9Pge",
    "It is in Britain’s geo-strategic interests to be pretty intimately engaged in the doings of a continent that has a grim 20th-century history, and whose agonies have caused millions of Britons to lose their lives http://bit.ly/2JW9Pge",
    "I would vote to stay in the single market. I'm in favour of the single market. I want us to be able to trade freely with our European friends and partners http://bit.ly/2NoAcxC",
    "We can’t leave Europe. We’re part of the European Continent. What is the English Channel? It’s a primeval river that got slightly too big http://bit.ly/2rcUrp9",
    "Suppose Britain voted tomorrow to come out. We'd still have huge numbers of staff trying to monitor what was going, only we wouldn't have any vote at all. Now I don't think that's actually a prospect that's likely to appeal http://bit.ly/2JY9TvQ",
    "I'm the great-grandson of Turkish immigrants - where would my family be if London hadn't given sanctuary to my great-grandfather? So I'm totally in favour of people being able to make their lives in another country http://bit.ly/32p8g0P",
    "It is economically illiterate to blame eastern Europeans for getting up early and working hard and being polite and helpful and therefore enabling the London catering trade to flourish http://bit.ly/36Hbn7u",
    "I’m probably about the only politician I know of who is actually willing to stand up and say that he’s pro-immigration http://bit.ly/2PV1iOm",
    "The trouble is, I am not an ‘outer’ http://bit.ly/2NLrKr8",
    "There are tangible benefits to our membership of the European Union http://bit.ly/2WZrsBj",
    "I believe in the free market of services and all those things http://bit.ly/2rcUrp9",
    "I am not by any means an ultra-Eurosceptic. In some ways, I am a bit of a fan of the European Union. If we did not have one, we would invent something like it http://bit.ly/2WZrsBj",
    "It is hard to think of a measure that the Government could have brought to the House that I could support more unreservedly and with greater pleasure than this Bill to expand the European Union http://bit.ly/2WZrsBj",
    "Look at Athens and Sparta. Athens was an open city and Sparta kicked people out. Go and look at the ruins of Athens and Sparta now and ask which of the two cities made the greatest contribution to civilisation http://bit.ly/2JZypNo",
    "My ideal world is, we're there, we're in the EU, trying to make it better http://bit.ly/2rcUrp9",
    "No one seems worried about the UK’s EU referendum. They are smart enough to know that Britain will remain, whatever happens, in a European free-trade zone http://bit.ly/2WWRbdy",
    "Together with Nato the European Community, now Union, has helped to deliver a period of peace and prosperity for its people as long as any since the days of the Antonine emperors http://bit.ly/2CkLblb",
    "I'm one of the politicians willing to stand up for immigration http://bit.ly/2JZypNo",
    "There may be a risk that international companies and funds could be put off from investing in the UK by the notion that Britain has somehow cut itself off from a giant European market http://bit.ly/34GuyfN",
    "We may be putting UK firms at a long-term disadvantage if we are no longer able to influence the setting of standards and regulations in Brussels http://bit.ly/34GuyfN",
    "There is a risk that leaving the EU will be globally interpreted as a narrow, xenophobic, backward-looking thing to do http://bit.ly/34GuyfN",
    "I always came down in favour, narrowly, of staying http://bit.ly/2WWSiKg",
    "Personally, I would like to stay in the single market. We need to stay in the council of ministers of the internal market https://www.bbc.com/news/uk-politics-21800089"
]

const quotes2 = []

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendTweet () {
    let tweetArray

    if(UsingQuotes1) {
        let tweetIndex = getRandomInt(0, quotes1.length -1)
        let tweetText = quotes1[tweetIndex]
        quotes2.push(quotes1.splice(tweetIndex, 1)[0])
        let matchUpper = getRandomInt(CHARACTER_LOWER_LIMIT, CHARACTER_UPPER_LIMIT)
        let tweetRegex = new RegExp(`.{1,${matchUpper}}`, 'g')
        tweetArray = tweetText.match(tweetRegex)
        quotes1.length === 0 ? UsingQuotes1 = false : UsingQuotes1 = true;
    } else if (!UsingQuotes1) {
        let tweetIndex = getRandomInt(0, quotes2.length -1)
        let tweetText = quotes2[tweetIndex]
        quotes1.push(quotes2.splice(tweetIndex, 1)[0])
        let matchUpper = getRandomInt(CHARACTER_LOWER_LIMIT, CHARACTER_UPPER_LIMIT)
        let tweetRegex = new RegExp(`.{1,${matchUpper}}`, 'g')
        tweetArray = tweetText.match(tweetRegex)
        quotes2.length === 0 ? UsingQuotes1 = true : UsingQuotes1 = false;
    }

    for (i = 0; i < tweetArray.length; i++) { 
        tweet = `${tweetArray[i]}`
        
        await sleep(5000)
        console.log(`Tweeting: ${tweet}`)

        Twitter.post('statuses/update', { status: tweet }, function(err, data, response) {
            if (!err) {
                console.log('Success')
            } else {
                console.log(err)
            }
        })
    }
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function queueTweets () {
    sendTweet()
    setInterval(sendTweet, INTERVAL)
}

queueTweets()


// pointless server so that Heroku doesn't crash the app when it's unable to bind it to a port

server = http.createServer(function (req, res) {
}).listen(process.env.PORT || 5000);

server.on('request', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Boris Bot is alive \'n\' kickin\'');
  res.end('\n');
});
