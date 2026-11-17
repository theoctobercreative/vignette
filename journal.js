/* Vignette by Thryft · journal page
   Reads the HUD's Core, Diary, and Mail scripts and writes your life in little scenes.
   Edit the words in TEXT and LETTERS freely; every journal picks them up next time it opens. */
(function () {
  'use strict';

  var V = window.VIGNETTE || {};
  var app = document.getElementById('app');

  // ============================================================
  //  WORDS
  // ============================================================

  var RITUALS = [
    { name: 'Rested',   what: 'The bedside tray, candlelight, dozing in bed, a quiet night in' },
    { name: 'Tidy',     what: 'Folding sweaters, the cleaning caddy, putting things back' },
    { name: 'Pampered', what: 'The vanity tray, perfume and powder, fresh flowers, the apothecary shelf' },
    { name: 'Inspired', what: 'Hobbies, tarot, incense, a photo, wandering somewhere new' },
    { name: 'Social',   what: 'Calling cards, sealed letters, nights out, dancing' }
  ];

  var HOBBIES = [
    { code: 'knit',    name: 'Knitting' },
    { code: 'sew',     name: 'Sewing' },
    { code: 'journal', name: 'Journaling' },
    { code: 'tarot',   name: 'Tarot' },
    { code: 'candle',  name: 'Candlemaking' },
    { code: 'press',   name: 'Pressed Flowers' },
    { code: 'letter',  name: 'Letter Writing' },
    { code: 'paint',   name: 'Porcelain Painting' }
  ];
  var TIERS = [
    { title: 'Dabbler',  xp: 0 },
    { title: 'Hobbyist', xp: 100 },
    { title: 'Devoted',  xp: 300 },
    { title: 'Artisan',  xp: 700 },
    { title: 'Master',   xp: 1500 }
  ];

  var SERIES = [
    { name: 'Porcelain Buttons', when: 'Any time', color: '#D9D2E2', items: ['Lilac Rosette', 'Blush Scallop', 'Cream Cameo', 'Trianon Daisy', 'Pearl Dome', 'Brass Oval', 'Lavender Shell', 'Powder Heart', 'Star Shank', 'Crescent Moon', 'Little Bee', 'Gilded Swan'] },
    { name: 'Pressed Flowers', when: 'Any time', color: '#EFE3E0', items: ['Lavender Sprig', 'Blush Sweet Pea', 'Cream Rose', 'Forget-Me-Not', 'Pansy', 'Lilac Bloom', 'Cornflower', 'Hydrangea Petal', 'Peony', 'Violet', 'Lily of the Valley', 'Moonflower'] },
    { name: 'Moth Charms', when: 'Midnight to 4am SLT', color: '#C3BFCA', items: ['Luna Moth', 'Silver Ghost', 'Lilac Hawk', 'Powder Moth', 'Brass Wing', 'Pearl Moth', 'Dusk Moth', 'Cameo Moth', 'Velvet Moth', 'Lantern Moth', 'Star Moth', 'Séance Moth'] },
    { name: 'Seasonal Charms', when: 'Three per season', color: '#E6E2EC', seasonal: true, items: ['Blossom Brooch', 'Robin’s Egg', 'Garden Key', 'Seashell Locket', 'Sun Hat Pin', 'Lavender Fan', 'Candle Stub', 'Séance Bell', 'Harvest Moon', 'Snowflake Pin', 'Velvet Mitten', 'Silver Star'] },
    { name: 'Postage Stamps', when: 'From letters and travel', color: '#DCE1E7', items: ['Lilac Penny', 'Trianon Blue', 'Blush Rose', 'Cream Cameo', 'Swan Post', 'Garden Gate', 'Pearl Seal', 'Moonlit Airmail', 'Lavender Parcel', 'Royal Hatbox', 'Lyon Opera', 'Inverted Swan'] },
    { name: 'Dance Cards', when: 'Nights out and dance floors', color: '#F0E7E2', items: ['Waltz', 'Foxtrot', 'Quadrille', 'Minuet', 'Gavotte', 'Polka', 'Cotillion', 'Mazurka', 'Tango', 'Galop', 'Pavane', 'The Last Dance'] }
  ];

  // Every Vignette-ready piece, for the Shop tab and the little pictures on Rituals and Hobbies.
  // k: piece (rituals), hobby (a hobby kit), supply (used up into a finished piece), luxury (runs out or fades, no refill),
  //    refillable (runs out, takes a refill), refill, finished (made by a supply; not sold in the shop)
  // r: rituals it lifts · h: hobby it grows · fit: for a refill, the piece it tops up; for a refillable, its refill
  var CATALOG = [{"n":"Apothecary Shelf","k":"piece","p":129,"img":"apothecary-shelf-a","id":28851852,"r":"P,I","h":"","fit":"","line":"blend something lavender"},{"n":"Bedside Tray","k":"piece","p":129,"img":"bedside-tray-a","id":28851853,"r":"R","h":"","fit":"","line":"turn in for the night"},{"n":"Candlemaking Tray","k":"hobby","p":129,"img":"candlemaking-tray-b","id":28851874,"r":"I","h":"candle","fit":"","line":"pour a candle"},{"n":"Cleaning Caddy","k":"piece","p":129,"img":"cleaning-caddy","id":28851875,"r":"T","h":"","fit":"","line":"tidy up"},{"n":"Knitting Basket","k":"hobby","p":129,"img":"knitting-basket","id":28851892,"r":"I","h":"knit","fit":"","line":"knit a few rows"},{"n":"Sewing Basket","k":"hobby","p":129,"img":"sewing-basket-a","id":28851922,"r":"I","h":"sew","fit":"","line":"stitch a little"},{"n":"Vanity Tray","k":"piece","p":129,"img":"vanity-tray-b","id":28851935,"r":"P","h":"","fit":"","line":"powder and perfume"},{"n":"Calling Card Tray","k":"piece","p":79,"img":"calling-card-tray","id":28851862,"r":"S","h":"","fit":"","line":"leave a calling card"},{"n":"Dance Card","k":"piece","p":79,"img":"dance-card","id":28851876,"r":"S","h":"","fit":"","line":"a turn on the dance floor"},{"n":"Flower Press Kit","k":"hobby","p":79,"img":"flower-press-kit-c","id":28851884,"r":"I","h":"press","fit":"","line":"press a flower"},{"n":"Journal and Pen","k":"hobby","p":79,"img":"journal-and-pen-c","id":28851891,"r":"I,R","h":"journal","fit":"","line":"write a page"},{"n":"Letter Writing Set","k":"hobby","p":79,"img":"letter-writing-set-b","id":28851899,"r":"S","h":"letter","fit":"","line":"write a letter"},{"n":"Porcelain Painting Set","k":"hobby","p":79,"img":"porcelain-painting-set","id":28851908,"r":"I","h":"paint","fit":"","line":"paint a little porcelain"},{"n":"Sweater Stack","k":"piece","p":79,"img":"sweater-stack","id":28851926,"r":"T","h":"","fit":"","line":"fold the sweaters"},{"n":"Tarot Spread","k":"hobby","p":79,"img":"tarot-spread","id":28851930,"r":"I","h":"tarot","fit":"","line":"draw a card"},{"n":"Autumn Perfume Bottle","k":"luxury","p":59,"img":"perfume-bottle-autumn","id":28851904,"r":"P","h":"","fit":"","line":"iris and old paper"},{"n":"Spring Perfume Bottle","k":"luxury","p":59,"img":"perfume-bottle-spring","id":28851905,"r":"P","h":"","fit":"","line":"lilac and spring rain"},{"n":"Summer Perfume Bottle","k":"luxury","p":59,"img":"perfume-bottle-summer","id":28851906,"r":"P","h":"","fit":"","line":"peony and warm linen"},{"n":"Winter Perfume Bottle","k":"luxury","p":59,"img":"perfume-bottle-winter","id":28851907,"r":"P","h":"","fit":"","line":"powder and cold air"},{"n":"Powder Jar","k":"luxury","p":59,"img":"powder-jar","id":28851910,"r":"P","h":"","fit":"","line":"a soft puff of powder"},{"n":"Peony Bouquet","k":"luxury","p":59,"img":"peony-bouquet","id":28851902,"r":"P,I","h":"","fit":"","line":"heavy-headed peonies"},{"n":"Taper Candle Holder","k":"refillable","p":59,"img":"taper-candle-holder","id":28851928,"r":"R,I","h":"","fit":"Taper Candles","line":"let the room go soft"},{"n":"Votive Holder","k":"refillable","p":59,"img":"votive-holder","id":28851939,"r":"R,P","h":"","fit":"Votive Candles","line":"a little starlight"},{"n":"Incense Burner","k":"refillable","p":59,"img":"incense-burner","id":28851887,"r":"I","h":"","fit":"Incense Cones","line":"ask Tante Odile"},{"n":"Stationery Box","k":"refillable","p":59,"img":"stationery-box","id":28851925,"r":"S","h":"letter","fit":"Stationery Paper","line":"a fresh sheet of paper"},{"n":"Wax Seal Stamp","k":"refillable","p":59,"img":"wax-seal-stamp","id":28851940,"r":"S","h":"letter","fit":"Cream Sealing Wax","line":"seal it with a kiss"},{"n":"Instant Camera","k":"refillable","p":59,"img":"instant-camera","id":28851890,"r":"I","h":"","fit":"Instant Film","line":"snap a photo"},{"n":"Blotting Paper Pack","k":"supply","p":59,"img":"blotting-paper-pack","id":28851855,"r":"I","h":"press","fit":"","line":"press some pansies"},{"n":"Candle Wax Blocks","k":"supply","p":59,"img":"candle-wax-blocks","id":28851870,"r":"I","h":"candle","fit":"","line":"chop the wax and melt"},{"n":"Embroidery Floss Tin","k":"supply","p":59,"img":"embroidery-floss-tin","id":28851877,"r":"I","h":"sew","fit":"","line":"thread the first color"},{"n":"Paint Pot Set","k":"supply","p":59,"img":"paint-pot-set","id":28851901,"r":"I","h":"paint","fit":"","line":"a little porcelain to paint"},{"n":"Yarn Skein Bundle","k":"supply","p":59,"img":"yarn-skein-bundle","id":28851851,"r":"I","h":"knit","fit":"","line":"cast on something soft"},{"n":"Embroidered Hoop","k":"finished","p":79,"img":"embroidery-hoop-finished","id":28851879,"r":"I","h":"sew","fit":"","line":"proud of that one"},{"n":"Pressed Flower Frame","k":"finished","p":79,"img":"pressed-flower-frame","id":28851911,"r":"P","h":"press","fit":"","line":"pansies caught in brass"},{"n":"Poured Candle Tin","k":"finished","p":79,"img":"poured-candle-tin","id":28851909,"r":"R","h":"candle","fit":"","line":"smooth as cream"},{"n":"Stationery Paper","k":"refill","p":39,"img":"letter-paper-cream","id":28851896,"r":"","h":"","fit":"Stationery Box","line":"twelve cream sheets"},{"n":"Cream Sealing Wax","k":"refill","p":39,"img":"sealing-wax-ivory","id":28851919,"r":"","h":"","fit":"Wax Seal Stamp","line":"fifteen cream seals"},{"n":"Taper Candles","k":"refill","p":39,"img":"taper-candles","id":28851929,"r":"","h":"","fit":"Taper Candle Holder","line":"four fresh tapers"},{"n":"Votive Candles","k":"refill","p":39,"img":"votive-candles","id":28851938,"r":"","h":"","fit":"Votive Holder","line":"six little votives"},{"n":"Incense Cones","k":"refill","p":39,"img":"incense-cones","id":28851888,"r":"","h":"","fit":"Incense Burner","line":"ten cones for Odile"},{"n":"Instant Film","k":"refill","p":39,"img":"film-box","id":28851880,"r":"","h":"","fit":"Instant Camera","line":"ten fresh shots"}];
  var KIND_NAMES = { piece: 'Everyday pieces', hobby: 'Hobbies', luxury: 'Little luxuries', refillable: 'Refillables' };
  var SHOP_SLURL = 'Mallo';

  // Keepsakes Aunt Odile mentions in her letters: [chapter, letter, name, note, picture or icon]
  var ODILE_KEEPS = [
    [0, 2, 'Lilac Rosette Button', 'From the coat of a man who swore he could speak to the dead.', 'img:0.0'],
    [0, 5, 'Small Brass Key', 'Inside the keepsake box. It opens something, after midnight.', 'key'],
    [1, 4, 'A Little Moth', 'The messenger you found for her.', 'img:2.0'],
    [1, 5, 'Heart-Shaped Pointer', 'From the planchette box. It still sticks on the letter O.', 'heart'],
    [2, 2, 'Linen Water', 'Mother’s first card: lavender, rainwater, pillowcases.', 'card'],
    [2, 3, 'For Dark Evenings', 'Her candle card. Pour slowly, think of someone.', 'card'],
    [2, 4, 'Pressed Flower Sachets', 'Violets, a heavy book, and patience.', 'card'],
    [2, 5, 'The Blank Card', 'Odile’s own, at the back of the box. Yours to fill.', 'card']
  ];

  var TAROT = [
    ['The Fool', 'A fresh start wants you'], ['The Magician', 'You already have what you need'],
    ['The High Priestess', 'Trust the quiet hunch'], ['The Empress', 'Make something beautiful'],
    ['The Emperor', 'A little order goes a long way'], ['The Hierophant', 'An old tradition is worth keeping'],
    ['The Lovers', 'Choose with your heart'], ['The Chariot', 'Keep going, gently'],
    ['Strength', 'Softness is a kind of strength'], ['The Hermit', 'A quiet night will do you good'],
    ['Wheel of Fortune', 'Something is turning'], ['Justice', 'Be fair to yourself'],
    ['The Hanged Man', 'Look at it from another angle'], ['Death', 'Let one thing end so another can begin'],
    ['Temperance', 'Balance, little by little'], ['The Devil', 'Notice what holds you'],
    ['The Tower', 'A shake-up clears the air'], ['The Star', 'Hope is a good thing to carry'],
    ['The Moon', 'Not everything needs explaining'], ['The Sun', 'Let yourself be glad'],
    ['Judgement', 'An old note is calling back'], ['The World', 'Something comes full circle']
  ];

  var TAROT_REV = ['look before you leap, just a little', 'a talent is waiting to be used', 'you know more than you’re saying',
    'be as tender with yourself as with others', 'loosen your grip a little', 'it’s all right to do it your own way',
    'something wants an honest talk', 'slow down and steer', 'rest is not giving up', 'don’t hide away too long',
    'wait for the wheel to come round', 'let an old score go', 'stop waiting for permission', 'you’re holding on to something finished',
    'too much of one thing; even it out', 'you’re freer than you think', 'the storm is passing', 'let someone help you shine',
    'the fog is lifting', 'joy is coming, just slower', 'forgive the person you used to be', 'one last stitch and it’s finished'];
  var ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  // a little drawing for each card (drawn in the journal, no pictures needed)
  var TAROT_SIGIL = ['✧', '✦', '☾', '❀', '♔', '⚜', '♡', '✶', '❦', '✺', '◎', '⚖', '✝', '❧', '⚱', '⛓', '♜', '★', '☽', '☼', '✉', '◯'];
  var MOODS = ['', 'cozy', 'wistful', 'giddy', 'tired', 'proud', 'restless', 'in love', 'quiet'];
  var PLACE_TEXT = {
    shop:   ['Went shopping at <b>{x}</b> and came home with ideas.', 'Browsed <b>{x}</b> for a while. Everything wanted to come home with me.'],
    club:   ['A night out at <b>{x}</b>.', 'Went dancing at <b>{x}</b>, or near enough.'],
    cafe:   ['Sat a while at <b>{x}</b> with something warm.', 'Stopped in at <b>{x}</b>. Exactly what I needed.'],
    nature: ['Took the long way through <b>{x}</b>. Fresh air, at last.', 'Wandered <b>{x}</b> and let my mind go quiet.'],
    art:    ['Spent an inspired hour at <b>{x}</b>.', 'Lost track of time at <b>{x}</b>.'],
    chapel: ['Sat in the quiet at <b>{x}</b>.', 'Stopped by <b>{x}</b>. Somebody was always getting married there.'],
    town:   ['Spent time around <b>{x}</b>. It felt like being part of something.', 'Out and about in <b>{x}</b>, saying hello to neighbors.'],
    home:   ['Visited <b>{x}</b>. Someone’s home, lived in and lovely.', 'Stopped by <b>{x}</b>. Every house has its own smell, and this one was nice.']
  };

  var WEATHER = [
    'Soft rain against the window', 'A lilac sky and no wind at all', 'Fog lifting slowly off the rooftops',
    'Bright and cold, the good kind', 'A warm breeze through the curtains', 'Grey and gentle, a day for staying in',
    'The first frost on the glass', 'Sun through thin clouds', 'A thunderstorm somewhere far off',
    'A pale pink morning', 'Wind rattling the shutters', 'Everything hushed after snow',
    'A golden, slanting light', 'Drizzle and the smell of wet stone', 'Blue sky like a clean sheet',
    'A strange, glittering mist'
  ];

  var ERRANDS = [
    'Fold something soft.', 'Sit at your vanity a while.', 'Write to someone.', 'Wander somewhere new.',
    'Make something with your hands.', 'Leave a calling card.', 'Turn in early tonight.', 'Draw a card.',
    'Press a flower.', 'Pour a new candle.'
  ];

  var DREAMS = [
    'of a house with one more room than it should have', 'of a train made entirely of porcelain',
    'of swimming slowly through a library', 'of a moth the size of a hand mirror, very polite',
    'of a hatbox that kept getting deeper', 'of dancing with someone I haven’t met yet',
    'of a garden where every flower was pressed flat', 'of letters falling like snow',
    'of a staircase that went down into the sea', 'of my reflection waving first',
    'of a velvet theatre with one seat', 'of a key that fit every door but one',
    'of a lilac fog full of whispering', 'of a ballroom on the moon', 'of my grandmother’s hands, knitting',
    'of a clock that ran backwards, kindly'
  ];

  // {x} = extra, {card}, {meaning}, {dream}, {item}, {series}
  var TEXT = {
    vanity:   ['Sat at the vanity a while, powder and a little perfume, nowhere in particular to be.', 'Fixed my face in the vanity mirror and decided I liked it.', 'A little powder, a little perfume. The vanity always knows what to do.'],
    sleep:    ['Turned in for the night and dreamed {dream}.', 'Went to bed early and dreamed {dream}.', 'Slept like a stone, then dreamed {dream}.'],
    dream:    ['Dozed off in my chair and dreamed {dream}.', 'Nodded off for a while. I dreamed {dream}.'],
    sweaters: ['Folded the sweaters back into a soft little tower. The room breathes easier.', 'Refolded every sweater, cream on the bottom, lilac on top, the way it should be.', 'Tidied the sweater stack. Small order, big relief.'],
    caddy:    ['Dusted the shelves and the corners nobody looks at.', 'Gave the place a proper tidy. Everything back where it belongs.', 'Feather duster, linen spray, and a little humming. The rooms feel lighter.'],
    apoth:    ['Blended something lavender-scented at the apothecary shelf.', 'Mixed a little salve from the jars on the shelf. It smells like a calm afternoon.', 'Spent a while among the apothecary jars, measuring and sniffing.'],
    knit:     ['Knit a few rows by the window.', 'Picked up the knitting again. The scarf is getting somewhere.', 'Knit until my hands were warm and the ball of yarn was small.'],
    sew:      ['Stitched a little at the sewing basket.', 'Mended a hem and added a tiny flower for no reason at all.', 'Sat with the sewing basket and lost track of time.'],
    journal:  ['Wrote in the little journal for a while.', 'Filled a page with nothing important and everything true.', 'Pen, journal, a quiet hour. Exactly that.'],
    tarot:    ['Drew a card: <b>{card}</b>. {meaning}.', 'The cards said <b>{card}</b>. {meaning}.', 'Turned over <b>{card}</b>. {meaning}.'],
    feuil:    ['{x}'],
    candle:   ['Poured a new candle and let it set slowly.', 'Made a candle in a blush vessel. It needs a day to cure.', 'Melted, poured, waited. One more candle for the dark evenings.'],
    press:    ['Pressed a flower between the pages of a heavy book.', 'Opened the flower press to check on the violets.', 'Laid petals in the press, one by one.'],
    letter:   ['Wrote a letter at the desk and sealed it with cream wax.', 'Sat with the stationery box and wrote to someone I miss.', 'Pressed the wax seal into a fresh envelope. Very satisfying.'],
    paint:    ['Painted tiny flowers onto a porcelain dish.', 'Spent a while painting porcelain, slow brushstrokes in lilac and blue.', 'Painted a little more of the porcelain set. My hand is steadier now.'],
    calling:  ['Left a calling card at <b>{x}</b>’s. The tray was already filling up.', 'Stopped by <b>{x}</b>’s and left my card on the brass tray.'],
    card:     ['<b>{x}</b> left a calling card on the tray.', 'Found <b>{x}</b>’s calling card waiting for me.'],
    postcard: ['Kept a postcard from <b>{x}</b>.', 'Picked up a postcard at <b>{x}</b>. It’s going on the mirror.'],
    photo:    ['Took an instant photo at <b>{x}</b> and watched it develop.', 'Snapped a photo at <b>{x}</b>. It came out softer than I expected, which I liked.', 'One more photo for the album: <b>{x}</b>.'],
    paper:    ['Took out a sheet of {paper} stationery{wax}.', 'Set a sheet of {paper} paper on the desk{wax}. Now, who to write to.'],
    visit:    ['Back at <b>{x}</b>.{note}', 'Stopped by <b>{x}</b> again.{note}'],
    star:     ['Starred <b>{x}</b> as one of my places.{note}'],
    with:     ['Spent a good long while with <b>{x}</b> today.', 'Lost an afternoon talking with <b>{x}</b>.', 'Kept <b>{x}</b> company for a while. Good company too.'],
    event:    ['Signed the guestbook at <b>{x}</b>.', 'Went to <b>{x}</b> and signed my name in the book.'],
    dance:    ['Danced until my feet complained.', 'Took a turn on the dance floor. Then another.', 'Danced. That’s all, and it was enough.'],
    out:      ['Spent a while out with people in <b>{x}</b>. My cheeks hurt from smiling.', 'A lively stretch in <b>{x}</b>, surrounded by good company.'],
    region:   ['Wandered into <b>{x}</b> for the first time.', 'Found my way to <b>{x}</b> and got a new stamp.', 'First visit to <b>{x}</b>. I’ll be back.'],
    find:     ['Found a little treasure: <b>{item}</b>.', 'Something small and lovely turned up: <b>{item}</b>.'],
    complete: ['Completed the <b>{series}</b>. Every single one.'],
    errand:   ['Finished today’s errand: {x}'],
    maison:   ['My Home Score rose to <b>{x}</b>. The place is starting to feel like me.'],
    sent:     ['Sent a sealed letter to <b>{x}</b>.'],
    letterin: ['A sealed letter arrived from <b>{x}</b>.'],
    pagein:   ['<b>{x}</b> tore out a page of their journal and sent it to me.'],
    giftin:   ['<b>{x}</b> sent me a little find: <b>{item}</b>.'],
    giftout:  ['Sent a spare little find to <b>{x}</b>.'],
    odile:    ['A letter from Aunt Odile arrived.']
  };

  var LETTERS = [
    {
      title: 'The Inheritance',
      gift: 'Odile’s Keepsake Box',
      hints: ['', 'Arrives after a little pampering', 'Arrives after you make something with your hands', 'Arrives after you wander somewhere new, three times', 'Arrives after you visit someone'],
      letters: [
        { greet: 'My dear,', body: ['If this has reached you, the solicitors finally did something useful. I’ve left you my things. Not the house, darling, the house was always too drafty. The things. Thirty years of little treasures, each one found somewhere I probably shouldn’t have been.', 'They’ll come to you slowly, because I hid them slowly. Look after yourself first. A rested girl finds more than a tired one.'], sign: 'Always, Aunt Odile', ps: 'P.S. Do sit at your vanity tonight. I insist.' },
        { greet: 'Darling,', body: ['There. Doesn’t that feel better? I spent my twenties in Lyon learning that powder fixes nothing and everything.', 'The first treasure is a porcelain button, lilac, with a tiny rosette. It came off the coat of a man who swore he could speak to the dead. He couldn’t, but he danced beautifully. Keep it somewhere you’ll see it. Now find something to do with your hands.'], sign: 'O.' },
        { greet: 'My darling,', body: ['Make something terribly impractical and beautiful. That is the whole point of hands.', 'Now, some of my things aren’t in boxes at all. They’re scattered, a few in places I loved, and you’ll only find them by wandering. Go see somewhere new. Go see three somewhere news. Grammar can wait.'], sign: 'With love, O.' },
        { greet: 'Darling,', body: ['You’ve been out! Good. I’ll confess something: every place I ever loved, I loved because of the people in it.', 'So go knock on someone’s door. Leave a calling card. Let somebody know you were there. I left mine all over Europe, and half of them are still on mantelpieces. The last letter comes after.'], sign: 'O.' },
        { greet: 'My dearest,', body: ['So now you know my secret. There was never any treasure worth more than a life arranged prettily and lived on purpose.', 'Still, a promise is a promise, so I’ve sent my keepsake box. Open it gently. Inside is a small brass key, and I won’t tell you what it opens. Not yet. Some doors are only for after midnight.', 'Live in little scenes, my darling. Make them lovely.'], sign: 'Always, always, Aunt Odile' }
      ]
    },
    {
      title: 'The Séance Letters',
      gift: 'Odile’s Planchette Box',
      hints: ['', 'Arrives after you do something lovely after midnight SLT', 'Arrives after you draw a tarot card', 'Arrives after you find a Moth Charm', 'Arrives after you send someone a sealed letter'],
      letters: [
        { greet: 'Darling,', body: ['The key. You’ve been wondering. It opens a planchette box I kept under a loose board in Lyon, and it isn’t ready for you yet. Spirits, like cats and good perfume, prefer to arrive on their own schedule.', 'Stay up late one night this week. Do something lovely after midnight, when the house is quiet and listening.'], sign: 'O.' },
        { greet: 'Darling,', body: ['You stayed up. I could tell; the letters always come easier when someone’s awake on the other end.', 'In 1974 I sat at a séance table with a duchess, a dentist, and a very bored medium. Nothing happened until the dentist sneezed, and then everything did. Draw a card for me. I want to know what the table says about you.'], sign: 'O.' },
        { greet: 'My dear,', body: ['Interesting card. I won’t say good or bad. Cards are never either, they’re only honest.', 'The medium told me once that moths are messengers, that they carry the small news the dead can’t be bothered to write down. Find me one. They come out late, after midnight.'], sign: 'O.' },
        { greet: 'There you are,', body: ['Holding a little moth. Keep it.', 'Now, a confession: the séances were never really about the dead. They were about sitting in the dark with people you’d otherwise never have spoken to. Write to someone, darling. A real letter, sealed. The living deserve mail too.'], sign: 'O.' },
        { greet: 'My dearest,', body: ['The planchette box is yours. It’s lilac inside, and the little heart-shaped pointer still sticks a bit on the letter O, which I’ve always taken personally.', 'Use it at parties. Use it alone, if you must. Ask it sensible questions and you’ll get sensible answers, which is the dull way to do it.', 'There is one more box. Kitchen things, my mother’s. Soon.'], sign: 'Always, Aunt Odile' }
      ]
    },
    {
      title: 'The Kitchen Witch’s Recipe Box',
      gift: 'Odile’s Recipe Box',
      hints: ['', 'Arrives after you tidy something', 'Arrives after you pour a candle', 'Arrives after you press a flower', 'Arrives after you visit someone'],
      letters: [
        { greet: 'Darling,', body: ['My mother kept a recipe box, and not one card in it is for food. She was what the village called a kitchen witch, which mostly meant she knew how to make a house feel like somebody loved it. Linen water, drawer sachets, candles for dark evenings.', 'Start where she always started: tidy one small corner. The rest follows.'], sign: 'O.' },
        { greet: 'Well done.', body: ['Her first card is linen water: lavender, a splash of something strong, rainwater if you can catch it, sprayed on pillowcases before guests. The trick, she said, is that a tidy room makes people tell the truth.', 'The next card is candles. Make one. Pour it slowly and think of someone while it sets.'], sign: 'O.' },
        { greet: 'My dear,', body: ['A candle you made yourself burns differently. Don’t ask me to prove it.', 'Mother’s next card is the most beautiful one in the box: pressed flowers between the pages of a heavy book, then sewn into little sachets for the linen cupboard. Press something. Violets, if you can find them. Patience is the whole recipe.'], sign: 'O.' },
        { greet: 'Look at you,', body: ['With flowers in your books.', 'Her last card isn’t a recipe at all. It just says, in her wobbly writing, “Open the door.” A kitchen witch’s house is only finished when someone walks into it. Go and leave a calling card somewhere. Let a friend know your door is open.'], sign: 'O.' },
        { greet: 'My dearest,', body: ['The recipe box is yours now, every card illustrated in her hand, and I’ve added one of my own at the back. It’s blank. That one’s for you to fill.', 'I’ve loved writing to you, my dear. I think I always meant to, and only needed the excuse of being gone.', 'Live in little scenes. Make them lovely.'], sign: 'Always, always, always, Aunt Odile' }
      ]
    }
  ];

  var MAISON_TIERS = [[0, 'Bare Rooms'], [50, 'Settling In'], [150, 'Lived-In'], [300, 'A Proper Nest'], [500, 'Home Sweet Home']];

  // ============================================================
  //  DATA
  // ============================================================

  var core = null, diary = { e: [], w: [] }, mail = [];
  var tab = 'diary';
  var entryMood = '';
  var openLetter = null;
  var formFor = null;

  function url(which, extra) { return V[which] + '/?k=' + encodeURIComponent(V.k) + (extra || ''); }

  function get(which, extra) {
    if (V.demo) return Promise.resolve(extra ? V.demo.wishes : V.demo[which]);
    return fetch(url(which, extra), { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (t) { return JSON.parse(t); });
  }

  function post(which, body) {
    if (V.demo) { toast('Preview only: nothing was sent.'); return Promise.resolve({ ok: 1 }); }
    return fetch(url(which), { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain' } })
      .then(function (r) { return r.text(); })
      .then(function (t) { try { return JSON.parse(t); } catch (e) { return { ok: 0 }; } });
  }

  // the journal follows along live: Senses counts every change, and the page asks a few times a minute
  var lastVer = null, polling = false;
  function busy() {
    var a = document.activeElement;
    return (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA') && a.value) || document.querySelector('.veil') || formFor !== null;
  }
  function poll() {
    if (V.demo || polling) return;
    polling = true;
    get('core', '&v=1').then(function (r) {
      polling = false;
      var v = r && r.v != null ? r.v : null;
      if (v === null) return;
      if (lastVer !== null && v !== lastVer && !busy()) { lastVer = v; refresh(); }
      else if (lastVer === null || !busy()) lastVer = v;
    }).catch(function () { polling = false; });
  }
  function refresh() {
    var main = app.querySelector('main'), y = main ? main.scrollTop : 0;
    return load(true).then(function () { var m = app.querySelector('main'); if (m) m.scrollTop = y; });
  }
  setInterval(poll, 3000);

  function load(quiet) {
    return Promise.all([get('core'), get('diary'), get('diary', '&w=1'), get('mail')]).then(function (res) {
      core = res[0]; diary = { e: res[1] || [], w: res[2] || [] }; mail = res[3] || [];
      render();
      if (!quiet) maybeGuide();
    }).catch(function () {
      if (!quiet) app.innerHTML = '<p class="opening">The pages are stuck together. Close and reopen your journal.</p>';
    });
  }

  // ============================================================
  //  HELPERS
  // ============================================================

  function bar(s) { return String(s).replace(/[|~\n\r]/g, ' ').trim(); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function slOff() { var o = Number(V.slOffset || 25200); if (o < 0) o += 86400; return o; }
  function slDate(unix) { return new Date((Number(unix) - slOff()) * 1000); } // read with getUTC*
  function slDayIndex(unix) { return Math.floor((Number(unix) - slOff()) / 86400); }
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function dayName(unix) { var d = slDate(unix); return DAYS[d.getUTCDay()] + ', ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate(); }
  function shortDate(unix) { var d = slDate(unix); return MONTHS[d.getUTCMonth()].slice(0, 3) + ' ' + d.getUTCDate(); }
  function timeWord(unix) {
    var h = slDate(unix).getUTCHours();
    if (h < 5) return 'After midnight';
    if (h < 8) return 'Early morning';
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    if (h < 21) return 'Evening';
    return 'Late evening';
  }
  function pick(list, seed) { return list[Math.abs(Number(seed) || 0) % list.length]; }
  function pic(sp) {
    var p = String(sp).split('.');
    return (V.base || '.') + '/trouvailles/' + (+p[0]) + '-' + (+p[1]) + '.jpg';
  }
  function thumbHtml(sp, cls) { return '<img class="' + (cls || 'tthumb') + '" src="' + esc(pic(sp)) + '" alt="" loading="lazy">'; }
  function pieceImg(c) { return (V.base || 'https://theoctobercreative.github.io/vignette') + '/pieces/' + c.img + '.jpg'; }
  function pieceStrip(list, max) {
    if (!list.length) return '';
    var seen = {}, out = '<div class="strip">';
    list.filter(function (c) { if (seen[c.n]) return false; seen[c.n] = 1; return true; }).slice(0, max || 6).forEach(function (c) {
      out += '<button class="pthumb" data-act="shopview" data-id="' + c.id + '" data-name="' + esc(c.n) + '" title="' + esc(c.n) + '"><img src="' + esc(pieceImg(c)) + '" alt="" loading="lazy"><span>' + esc(c.n) + '</span></button>';
    });
    return out + '</div>';
  }
  function cardHtml(i, rev, size) {
    var c = TAROT[i] || TAROT[0];
    return '<span class="tcard ' + (size || '') + (rev ? ' rev' : '') + '"><span class="tnum">' + ROMAN[i] + '</span><span class="tsig">' + TAROT_SIGIL[i] + '</span><span class="tname">' + esc(c[0]) + '</span></span>';
  }
  function lightbox(inner) {
    var veil = document.createElement('div'); veil.className = 'veil zoom';
    veil.innerHTML = '<div class="zoombox">' + inner + '<button class="link zclose" data-x>Close</button></div>';
    document.querySelector('.book').appendChild(veil);
    veil.onclick = function (ev) { if (ev.target === veil || ev.target.hasAttribute('data-x')) veil.remove(); };
  }
  function item(sp) {
    var p = String(sp).split('.'), s = SERIES[+p[0]];
    return s ? (s.items[+p[1]] || 'a little something') : 'a little something';
  }
  function rarity(series, piece) {
    if (SERIES[series].seasonal) return piece % 3 === 2 ? 'rare' : (piece % 3 === 1 ? 'uncommon' : 'common');
    return piece === 11 ? 'rare' : (piece >= 7 ? 'uncommon' : 'common');
  }
  function dupCount(s, p) { var d = core && core.dp ? String(core.dp).slice(1) : ''; return Number(d.charAt(s * 12 + p)) || 0; }
  function mood(v) { return v < 25 ? 'Wanting' : (v >= 70 ? 'Blooming' : 'Steady'); }
  function tierFor(xp) {
    var t = 0; for (var i = 0; i < TIERS.length; i++) if (xp >= TIERS[i].xp) t = i;
    return t;
  }
  function seasonNow() {
    var d = slDate(V.now || Date.now() / 1000), m = d.getUTCMonth() + 1, day = d.getUTCDate();
    if (m === 10 && day >= 15) return 'seance';
    if (m === 12) return 'winter';
    if (m === 2 && day <= 14) return 'valentine';
    return '';
  }

  // Turn one stored entry into prose
  function prose(e) {
    var code = e.code, x = e.extra, seed = e.id;
    if (code === 'note') return { html: '<div class="note' + (String(x).length > 70 ? ' long' : '') + '">' + esc(x) + '</div>', cls: 'mine' };
    if (code === 'entry') {
      var en = String(x).split('^');
      return { html: (en[0] ? '<div class="mood-tag">feeling ' + esc(en[0]) + '</div>' : '') + '<div class="note' + (en.slice(1).join('^').length > 70 ? ' long' : '') + '">' + esc(en.slice(1).join('^')) + '</div>', cls: 'mine' };
    }
    if (code === 'place') {
      var pk = String(x).split('^');
      return { html: pick(PLACE_TEXT[pk[0]] || PLACE_TEXT.town, seed).replace('{x}', esc(pk[1] || '')), cls: '' };
    }
    if (code === 'feuil') return { html: '<span class="from-stories">Vignette Stories</span> ' + esc(String(x).replace(/^(Le Feuilleton|Storybook|Vignette Stories) · /, '')), cls: 'special' };
    if (code === 'morning') return null;
    var list = TEXT[code];
    var fill = { x: esc(x) };
    if (code === 'tarot') {
      var tp = String(x).split('.'), c = TAROT[+tp[0]] || TAROT[0], rev = tp[1] === '1';
      fill.card = c[0] + (rev ? ', reversed' : ''); fill.meaning = rev ? TAROT_REV[+tp[0]].charAt(0).toUpperCase() + TAROT_REV[+tp[0]].slice(1) : c[1];
    }
    if (code === 'visit' || code === 'star') { var vp = String(x).split('^'); fill.x = esc(vp[0]); fill.note = vp[1] ? ' <i>' + esc(vp[1]) + '</i>' : ''; }
    if (code === 'sleep' || code === 'dream') fill.dream = DREAMS[+x] || DREAMS[0];
    if (code === 'find') fill.item = esc(item(x));
    if (code === 'complete') fill.series = esc((SERIES[+x] || {}).name || 'collection');
    if (code === 'errand') fill.x = esc(ERRANDS[+x] || '');
    if (code === 'paper') { var pw = String(x).split('`'); fill.paper = esc(pw[0] || 'cream'); fill.wax = pw[1] ? ' and warmed the ' + esc(pw[1]) + ' wax' : ''; }
    if (code === 'giftin') { var gp = String(x).split('^'); fill.x = esc(gp[0]); fill.item = esc(item(gp[1])); }
    if (code === 'odile') {
      var cs = String(x).split('.');
      var ch = LETTERS[+cs[0]];
      return { html: 'A letter from Aunt Odile arrived: <b>' + esc(ch ? ch.title : '') + '</b>, letter ' + esc(cs[1]) + '. <button class="link" data-go="histoires">Read it</button>', cls: 'special' };
    }
    if (!list) return { html: x ? esc(x) + '.' : 'A little moment.', cls: '' };
    var t = pick(list, seed).replace(/\{(\w+)\}/g, function (_, k) { return fill[k] != null ? fill[k] : ''; });
    if (code === 'find') t = thumbHtml(x) + t;
    if (code === 'tarot') t = cardHtml(+String(x).split('.')[0], String(x).split('.')[1] === '1', 'mini') + t;
    if (code === 'giftin') t = thumbHtml(String(x).split('^')[1]) + t;
    return { html: t, cls: (code === 'find' || code === 'complete' || code === 'errand' || code === 'visit') ? 'special' : '' };
  }

  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; var b = d.querySelector('button'); if (b) b.remove(); return d.textContent.trim(); }

  function parseEntries() {
    return (diary.e || []).map(function (s) {
      var p = String(s).split('~');
      return { id: +p[0], unix: +p[1], code: p[2], extra: p[3] || '', line: p[4] || '' };
    });
  }

  function pearls(level, of) {
    var out = '<div class="pearls">';
    for (var i = 0; i < of; i++) {
      var cls = level >= i + 1 ? 'on' : (level > i ? 'half' : '');
      out += '<span class="pearl ' + cls + '"></span>';
    }
    return out + '</div>';
  }

  var toastTimer;
  function toast(msg) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.style.display = 'none'; }, 2800);
  }

  function modal(title, quote, fields, okLabel, onOk) {
    var veil = document.createElement('div'); veil.className = 'veil';
    var html = '<div class="modal"><h3>' + esc(title) + '</h3>';
    if (quote) html += '<div class="quote">' + esc(quote) + '</div>';
    fields.forEach(function (f) {
      html += f.area ? '<textarea class="field" data-f="' + f.key + '" maxlength="' + (f.max || 500) + '" placeholder="' + esc(f.ph) + '"></textarea>'
                     : '<input class="field" data-f="' + f.key + '" maxlength="' + (f.max || 64) + '" placeholder="' + esc(f.ph) + '">';
    });
    html += '<div class="row" style="justify-content:flex-end"><button class="link" data-x>Cancel</button><button class="btn" data-ok>' + esc(okLabel) + '</button></div></div>';
    veil.innerHTML = html;
    document.querySelector('.book').appendChild(veil);
    var first = veil.querySelector('.field'); if (first) first.focus();
    veil.querySelector('[data-x]').onclick = function () { veil.remove(); };
    veil.querySelector('[data-ok]').onclick = function () {
      var vals = {}; veil.querySelectorAll('[data-f]').forEach(function (el) { vals[el.getAttribute('data-f')] = el.value.trim(); });
      veil.remove(); onOk(vals);
    };
  }

  // ============================================================
  //  PAGES
  // ============================================================

  function unreadCount() { return mail.filter(function (s) { var p = String(s).split('~'); return p[2] !== 'card' && p.pop() === '0'; }).length; }

  // ---------- finding your way ----------
  var TAB_HINTS = {
    diary: 'Everything you do lands here, newest first. Today’s Morning Post sits at the top.',
    rituals: 'Five little needs. Touching Vignette pieces fills them, and nothing bad happens when they’re low.',
    hobbies: 'Each hobby grows a little every time you practice it.',
    keepsakes: 'Little finds that turn up as you go. Spares can be gifted to friends.',
    letters: 'Letters and calling cards from friends, plus a place to write your own.',
    stamps: 'Your starred places, everywhere you’ve wandered, postcards, events, and your Home Score.',
    stories: 'Serial stories you play, a chapter at a time.',
    wishlist: 'Shop pieces you pinned by touching a display.',
    histoires: 'Aunt Odile’s story, a letter at a time. New letters unlock as you play.',
    shop: 'Every Vignette-ready piece, refill, and hobby supply. Tap one to open it on the Marketplace.'
  };
  var guideShown = false;

  function showGuide() {
    guideShown = true;
    try { localStorage.setItem('vg-guide', '1'); } catch (e) {}
    var veil = document.createElement('div'); veil.className = 'veil';
    var steps = [
      ['Touch your things', 'Pieces marked Vignette-ready write a little moment into your Diary when you touch them, and lift a Ritual or a Hobby.'],
      ['Read the Morning Post', 'Each day brings the weather, a card, and one small errand. Finish the errand for a little something extra.'],
      ['Wander and collect', 'New places become Stamps. Little finds turn up in Keepsakes along the way.'],
      ['Write back', 'Add your own line to any day, send a letter from the Letters page, or leave a calling card when you visit.'],
      ['Keep things stocked', 'Perfume, candles, flowers and other consumables run out over time. Refills and new pieces are in the Shop tab.']
    ];
    var html = '<div class="modal guide"><div class="g-eyebrow">Start here</div><h3>How your journal works</h3><div class="g-steps">';
    steps.forEach(function (st, i) {
      html += '<div class="g-step"><span class="g-num">' + (i + 1) + '</span><div><b>' + st[0] + '</b><p>' + st[1] + '</p></div></div>';
    });
    html += '</div><div class="g-eyebrow">Where things live</div><div class="g-map">';
    [['diary', 'Diary'], ['rituals', 'Rituals'], ['hobbies', 'Hobbies'], ['keepsakes', 'Keepsakes'], ['letters', 'Letters'], ['stamps', 'Stamps'], ['wishlist', 'Wishlist'], ['histoires', 'Aunt Odile'], ['shop', 'Shop']].forEach(function (t) {
      html += '<button class="g-tab" data-goto="' + t[0] + '"><b>' + t[1] + '</b><span>' + TAB_HINTS[t[0]] + '</span></button>';
    });
    html += '</div><p class="g-note">Click the cameo on your screen to open or close this journal. In chat, /8 status shows your rituals, /8 note adds a line to today, and /8 letter name message sends a letter.</p>'
      + '<div class="row" style="justify-content:flex-end"><button class="btn" data-x>Begin</button></div></div>';
    veil.innerHTML = html;
    document.querySelector('.book').appendChild(veil);
    veil.querySelector('[data-x]').onclick = function () { veil.remove(); };
    veil.onclick = function (ev) { if (ev.target === veil) veil.remove(); };
    veil.querySelectorAll('[data-goto]').forEach(function (b) {
      b.onclick = function () { tab = b.getAttribute('data-goto'); veil.remove(); render(); };
    });
  }

  function maybeGuide() {
    if (guideShown) return;
    var seen = false;
    try { seen = localStorage.getItem('vg-guide') === '1'; } catch (e) {}
    var fresh = parseEntries().filter(function (e) { return e.code !== 'morning'; }).length < 4;
    if (fresh && !seen) showGuide();
    guideShown = true;
  }

  function render() {
    var season = seasonNow();
    document.body.className = season;
    var glowing = core && core.r && core.r.every(function (v) { return v >= 7000; });
    var first = String(V.name || 'My').split(' ')[0];
    var tabs = [['diary', 'Diary'], ['rituals', 'Rituals'], ['hobbies', 'Hobbies'], ['keepsakes', 'Keepsakes'], ['letters', 'Letters'], ['stamps', 'Places'], ['wishlist', 'Wishlist'], ['histoires', 'Aunt Odile'], ['shop', 'Shop']];
    if (window.VignetteStories) tabs.splice(8, 0, ['stories', 'Stories']);
    var unread = unreadCount();
    var html = '<div class="book"><header class="top"><div class="cameo">V</div><div class="titles"><div class="eyebrow">Vignette · by Thryft</div><h1>' + esc(first) + '’s journal<em>a life in little scenes</em></h1></div>' + (glowing ? '<div class="glow">Glowing</div>' : '') + '<button class="how" data-act="guide">How it works</button></header><nav class="tabs">';
    tabs.forEach(function (t) {
      html += '<button data-tab="' + t[0] + '" class="' + (tab === t[0] ? 'on' : '') + '">' + t[1] + (t[0] === 'letters' && unread ? '<span class="dot"></span>' : '') + '</button>';
    });
    html += '</nav><div class="hint">' + esc(TAB_HINTS[tab] || TAB_HINTS.diary) + '</div><main>' + (PAGES[tab] || PAGES.diary)() + '</main></div>';
    app.innerHTML = html;
    wire();
  }

  var PAGES = {};

  PAGES.diary = function () {
    var entries = parseEntries();
    var out = '';
    var season = seasonNow();
    if (season === 'seance') out += '<div class="season-banner"><span class="script">Séance Season</span><span class="small">Moth Charms and the Séance Bell are out after dark until October 31.</span></div>';
    if (season === 'winter') out += '<div class="season-banner"><span class="script">Winter Pages</span><span class="small">Snowflake Pins, Velvet Mittens, and Silver Stars are turning up.</span></div>';

    // Morning Post: today's, from Core
    var todayIdx = slDayIndex(V.now || Date.now() / 1000);
    var morning = entries.filter(function (e) { return e.code === 'morning'; })[0];
    if (morning && core && core.mp) {
      var mp = String(morning.extra).split('.');
      var isToday = slDayIndex(morning.unix) === todayIdx;
      var card = TAROT[+mp[1]] || TAROT[0];
      var bonus = mp[3] != null ? TAROT[+mp[3]] : null;
      out += '<div class="post"><div><div class="label">Today’s weather</div><p>' + esc(WEATHER[+mp[0]] || WEATHER[0]) + '.</p></div>'
        + '<div><div class="label">Your card</div><p><span class="card-name">' + esc(card[0]) + '</span>. ' + esc(card[1]) + '.'
        + (bonus ? '<br><span class="muted small">Well rested, so a second card: <i>' + esc(bonus[0]) + '</i>.</span>' : '') + '</p></div>'
        + '<div><div class="label">One small errand</div><p>' + esc(ERRANDS[+mp[2]] || '') + '</p>'
        + (isToday && core.mp[3] ? '<div class="done">✦ Done</div>' : '') + '</div></div>';
    }

    out += '<div class="compose-entry"><textarea class="field" id="note" maxlength="250" placeholder="Write a page of your own for today…"></textarea>'
      + '<div class="row moods"><span class="label">Feeling</span>' + MOODS.slice(1).map(function (m) { return '<button class="mood-chip' + (entryMood === m ? ' on' : '') + '" data-act="mood" data-m="' + m + '">' + m + '</button>'; }).join('')
      + '<button class="btn" data-act="note">Keep it</button></div></div>';

    var shown = entries.filter(function (e) { return e.code !== 'morning'; });
    if (!shown.length) return out + '<p class="empty">Nothing written yet. Touch a Vignette-ready piece, wander somewhere new, or write a line above.</p>';

    var lastDay = null;
    shown.forEach(function (e) {
      var p = prose(e); if (!p) return;
      var d = slDayIndex(e.unix);
      if (d !== lastDay) { if (lastDay !== null) out += '</div>'; out += '<div class="day"><div class="day-head">' + esc(dayName(e.unix)) + '</div>'; lastDay = d; }
      out += '<div class="entry ' + p.cls + '"><div class="when">' + esc(timeWord(e.unix)) + '</div><div><div class="text">' + p.html + '</div>'
        + (e.line ? '<div class="added">' + esc(e.line) + '</div>' : '')
        + (formFor === e.id ? '<div class="inline-form row"><input class="field" id="line-' + e.id + '" maxlength="160" placeholder="Add your own line to this moment…"><button class="btn" data-act="saveline" data-id="' + e.id + '">Keep</button><button class="link" data-act="cancelline">Cancel</button></div>' : '')
        + '<div class="tools">' + (e.line ? '' : '<button class="link" data-act="addline" data-id="' + e.id + '">Add a line</button>') + '<button class="link" data-act="tear" data-id="' + e.id + '">Tear out this page</button></div>'
        + '</div></div>';
    });
    if (lastDay !== null) out += '</div>';
    return out;
  };

  PAGES.rituals = function () {
    var r = (core && core.r) || [6000, 6000, 6000, 6000, 6000];
    var out = '<h2 class="page">Rituals</h2><div class="sub">little ways of looking after yourself</div><div class="rituals">';
    RITUALS.forEach(function (rt, i) {
      var v = Math.round(r[i] / 100);
      var code = 'RTPIS'.charAt(i);
      var lifts = CATALOG.filter(function (c) { return c.r.indexOf(code) !== -1 && c.k !== 'supply'; });
      out += '<div class="ritual"><div class="name">' + rt.name + '</div><div>' + pearls(v / 10, 10) + '</div><div><span class="mood">' + mood(v) + '</span><div class="what">' + esc(rt.what) + '</div></div>'
        + '<div class="ritual-pieces">' + pieceStrip(lifts, 6) + '</div></div>';
    });
    out += '</div>';
    var glowing = r.every(function (v) { return v >= 7000; });
    out += '<div class="perks">'
      + '<div class="perk ' + (glowing ? 'on' : '') + '"><h4>Glowing</h4><p>All five rituals Blooming at once. Twice the chance of a little find.</p></div>'
      + '<div class="perk ' + (r[0] >= 7000 ? 'on' : '') + '"><h4>Well-Rested Morning</h4><p>Rested Blooming at the Morning Post draws you a second card.</p></div>'
      + '<div class="perk ' + (r[4] >= 7000 ? 'on' : '') + '"><h4>Social Butterfly</h4><p>Social Blooming makes the calling cards you leave count double.</p></div>'
      + '</div><p class="muted small" style="margin-top:18px">Rituals drift slowly while you’re online and never while you’re away. Nothing bad happens when they’re low; the journal just notices.</p>'
      + '<div class="note-card"><div><h4>Some pieces run out</h4><p>Candles, incense, film, stationery, and sealing wax run out, and a matching refill tops them back up. Perfume, powder, and fresh flowers are little luxuries: they’re used up or dry, and stay behind as decor. Hover over any of them to see what’s left.</p></div><button class="btn ghost" data-go="shop">See refills</button></div>';
    return out;
  };

  PAGES.hobbies = function () {
    var h = (core && core.h) || [0, 0, 0, 0, 0, 0, 0, 0];
    var out = '<h2 class="page">Hobbies</h2><div class="sub">practice makes a Master</div><div class="hobbies">';
    HOBBIES.forEach(function (hb, i) {
      var xp = h[i] || 0, t = tierFor(xp), next = TIERS[t + 1];
      var progress = next ? (xp - TIERS[t].xp) / (next.xp - TIERS[t].xp) * 5 : 5;
      var kit = CATALOG.filter(function (c) { return c.h === hb.code && c.k !== 'finished'; });
      var sup = CATALOG.filter(function (c) { return c.h === hb.code && c.k === 'supply'; })[0];
      var fin = CATALOG.filter(function (c) { return c.h === hb.code && c.k === 'finished'; })[0];
      out += '<div class="hobby"><h4>' + hb.name + '</h4><div class="title">' + TIERS[t].title + '</div>' + pearls(progress, 5)
        + '<div class="xp">' + (next ? (next.xp - xp) + ' to ' + next.title : 'Mastered') + '</div>' + pieceStrip(kit, 4)
        + (sup ? '<div class="muted small hobby-sup">' + esc(sup.n) + ': five sessions' + (fin ? ', then a ' + esc(fin.n) + ' of your own' : ', then a finished piece of your own') + '.</div>' : '') + '</div>';
    });
    out += '</div><p class="muted small" style="margin-top:18px">Every hobby piece you use adds to its craft. Writing your own lines grows Journaling, and sending letters grows Letter Writing.</p>';
    return out;
  };

  PAGES.keepsakes = function () {
    var tr = (core && core.tr) || [0, 0, 0, 0, 0, 0];
    var out = '<h2 class="page">Keepsakes</h2><div class="sub">little finds, found along the way</div>';
    SERIES.forEach(function (s, si) {
      var mask = tr[si] || 0, count = 0;
      for (var b = 0; b < 12; b++) if (mask & (1 << b)) count++;
      out += '<div class="series"><h3 class="section">' + s.name + '</h3><div class="series-head"><span class="muted small">' + esc(s.when) + '</span><span class="count">' + count + ' OF 12</span></div><div class="charms">';
      s.items.forEach(function (nm, pi) {
        var found = mask & (1 << pi), spare = dupCount(si, pi);
        out += '<div class="charm ' + (found ? 'found ' : '') + rarity(si, pi) + '" style="--c:' + s.color + '"' + (found ? ' data-act="zoom" data-sp="' + si + '.' + pi + '"' : '') + '><div class="oval">' + (found ? thumbHtml(si + '.' + pi, 'cimg') : '') + '</div><div class="nm">' + (found ? esc(nm) : '?') + '</div>'
          + (spare ? '<span class="spare" data-act="gift" data-sp="' + si + '.' + pi + '" title="Gift a spare">×' + spare + '</span>' : '') + '</div>';
      });
      out += '</div></div>';
    });
    out += '<p class="muted small" style="margin-top:16px">Tap a keepsake to look closer. Tap a × badge to send a spare to a friend. Trade by gifting each other.</p>';
    var tc = (core && core.tc) || 0, drawn = 0;
    for (var tb = 0; tb < 22; tb++) if (tc & (1 << tb)) drawn++;
    out += '<div class="series"><h3 class="section">Your Tarot Deck</h3><div class="series-head"><span class="muted small">Every card you draw at a tarot spread is kept here</span><span class="count">' + drawn + ' OF 22</span></div><div class="deck">';
    TAROT.forEach(function (c, i) {
      out += (tc & (1 << i)) ? '<button class="deck-card" data-act="card" data-id="' + i + '">' + cardHtml(i, false) + '</button>' : '<span class="deck-card back"><span class="tcard back"><span class="tsig">✦</span></span></span>';
    });
    out += '</div></div>';
    if (core && core.ch) {
      var keeps = ODILE_KEEPS.filter(function (k) { return core.ch[0] > k[0] || (core.ch[0] === k[0] && core.ch[1] >= k[1]); });
      out += '<h3 class="section">From Aunt Odile</h3>';
      if (!keeps.length) out += '<p class="empty">Little things she mentions in her letters will be kept here.</p>';
      else {
        out += '<div class="odile-keeps">';
        keeps.forEach(function (k) {
          var pic = k[4].indexOf('img:') === 0 ? thumbHtml(k[4].slice(4), 'kimg') : '<span class="kicon k-' + k[4] + '"></span>';
          out += '<div class="okeep"><div class="kpic">' + pic + '</div><div><h4>' + esc(k[2]) + '</h4><p class="muted small">' + esc(k[3]) + '</p><div class="kfrom">Chapter ' + (k[0] + 1) + ', letter ' + k[1] + '</div></div></div>';
        });
        out += '</div>';
      }
      var gifts = [];
      for (var c = 0; c < 3; c++) if (core.ch[0] > c || (core.ch[0] === c && core.ch[1] >= 5)) gifts.push(LETTERS[c].gift);
      if (gifts.length) out += '<p class="muted small" style="margin-top:10px">Sent to your inventory: ' + gifts.map(esc).join(' · ') + '.</p>';
    }
    return out;
  };

  // stationery letters arrive as "^paper`wax^words"
  function letterStyle(p) {
    var m = /^\^([a-z]*)`?([a-z]*)\^/.exec(String(p || ''));
    return m ? { paper: m[1], wax: m[2], text: String(p).slice(m[0].length) } : { paper: '', wax: '', text: String(p || '') };
  }

  PAGES.letters = function () {
    var out = '<h2 class="page">Letters</h2><div class="sub">sealed with your monogram</div>';
    var oc = core && core.ch ? core.ch[0] * 5 + core.ch[1] : 0;
    out += '<div class="note-card odile-link"><span class="seal">O</span><div><h4>Letters from Aunt Odile</h4><p>Her letters are kept together in their own tab, so the story reads in order.' + (oc ? ' You have ' + oc + (oc === 1 ? ' letter' : ' letters') + ' from her.' : '') + '</p></div><button class="btn ghost" data-go="histoires">Read them</button></div>';
    out += '<div class="compose"><div class="label">Write a sealed letter</div><input class="field" id="to" maxlength="64" placeholder="Their username, like sweetpea.resident"><textarea class="field" id="body" maxlength="500" placeholder="Dear…"></textarea><div class="row" style="justify-content:space-between"><span class="muted small">They’ll find it in their journal, or as an IM if they don’t wear Vignette.</span><button class="btn" data-act="send">Seal and send</button></div></div>';
    var items = mail.map(function (s) { var p = String(s).split('~'); return { id: +p[0], unix: +p[1], type: p[2], from: p[3], fromKey: p[4], payload: p[5], read: p[6] === '1' }; });
    var letters = items.filter(function (m) { return m.type !== 'card'; });
    var cards = items.filter(function (m) { return m.type === 'card'; });
    out += '<h3 class="section">Your letterbox</h3>';
    if (!letters.length) out += '<p class="empty">No letters yet. They’ll arrive here, even while you’re away.</p>';
    else {
      out += '<div class="letters">';
      letters.forEach(function (m) {
        var st = m.type === 'gift' ? { paper: '', wax: '', text: m.payload } : letterStyle(m.payload);
        var kind = m.type === 'page' ? 'A page from their journal' : (m.type === 'gift' ? 'A little find' : (st.paper ? 'On ' + st.paper + ' paper' + (st.wax ? ', ' + st.wax + ' wax' : '') : 'Sealed letter'));
        var sealCls = m.type === 'gift' ? 'gift' : (st.wax ? 'wax-' + st.wax : '');
        var body = m.type === 'gift' ? thumbHtml(m.payload) + 'They sent you <b>' + esc(item(m.payload)) + '</b>. It’s already in your Keepsakes.' : esc(st.text);
        out += '<div class="letter ' + (m.read ? '' : 'unread') + (st.paper ? ' paper-' + st.paper : '') + '" data-act="open" data-id="' + m.id + '"><div class="seal ' + sealCls + '">' + esc((m.from || '?').charAt(0)) + '</div><div><div class="from">' + esc(m.from) + '</div><div class="kind">' + kind + '</div>'
          + (openLetter === m.id ? '<div class="body">' + body + '</div><div class="row" style="margin-top:10px"><button class="link" data-act="reply" data-name="' + esc(m.from) + '">Write back</button></div>' : '')
          + '</div><div class="date">' + esc(shortDate(m.unix)) + '</div></div>';
      });
      out += '</div>';
    }
    out += '<h3 class="section">Calling cards left for you</h3>';
    if (!cards.length) out += '<p class="empty">Put a Calling Card Tray by your door, and visitors’ cards will collect here.</p>';
    else {
      out += '<div class="letters">';
      cards.forEach(function (m) {
        out += '<div class="letter"><div class="seal card">' + esc((m.from || '?').charAt(0)) + '</div><div><div class="from">' + esc(m.from) + '</div><div class="kind">Calling card</div></div><div class="date">' + esc(shortDate(m.unix)) + '</div></div>';
      });
      out += '</div>';
    }
    return out;
  };

  PAGES.stamps = function () {
    var out = '<h2 class="page">Places</h2><div class="sub">a passport of places and evenings</div>';
    var fv = ((core && core.fv) || []).map(function (s) { var p = String(s).split('~'); return { id: +p[0], region: p[1], parcel: p[2], note: p[3] || '' }; });
    out += '<h3 class="section">Starred places</h3><div class="note-card"><div><h4>Star where you are</h4><p>Your sister’s house, a favorite café, the shop you always end up at. Each time you come back, your journal notices. You can also type <i>/8 star</i> and a note in chat.</p></div><button class="btn ghost" data-act="star">Star this place</button></div>';
    if (fv.length) {
      out += '<div class="starred">';
      fv.slice().reverse().forEach(function (f) {
        out += '<div class="star-place"><span class="star-mark">★</span><div><h4>' + esc(f.parcel) + '</h4><div class="muted small">' + esc(f.region) + (f.note ? ' · <i>' + esc(f.note) + '</i>' : '') + '</div></div><button class="link" data-act="unstar" data-id="' + f.id + '">Unstar</button></div>';
      });
      out += '</div>';
    }
    var score = (core && core.ms) || 0, tier = MAISON_TIERS[0][1];
    MAISON_TIERS.forEach(function (t) { if (score >= t[0]) tier = t[1]; });
    out += '<div class="maison"><div><div class="label">Home Score</div><div class="score">' + score + '</div></div><div><div class="tier">' + tier + '</div><p class="muted small">Every Vignette-ready piece on your parcel counts, and different kinds count more.</p></div><button class="btn ghost" data-act="maison">Count my pieces</button></div>';

    function grid(list, cls, ring) {
      if (!list.length) return '<p class="empty">None yet.</p>';
      var g = '<div class="stamps">';
      list.slice().reverse().forEach(function (s) {
        var p = String(s).split('@');
        var name = p[0], second = p[1] || '';
        var date = cls === 'travel' && second ? shortDate(second) : second;
        g += '<div class="stamp ' + cls + '"><div class="ring">' + ring + '</div><div class="place">' + esc(name) + '</div><div class="date">' + esc(date) + '</div></div>';
      });
      return g + '</div>';
    }
    out += '<h3 class="section">Travel stamps · ' + ((core && core.wc) || 0) + ' regions</h3>' + grid((core && core.rn) || [], 'travel', 'VISITED');
    out += '<h3 class="section">Postcards</h3>' + grid((core && core.pc) || [], 'postcard', 'POSTCARD');
    out += '<h3 class="section">Event stamps</h3>' + grid((core && core.ev) || [], 'event', 'ATTENDED');
    return out;
  };

  PAGES.wishlist = function () {
    var out = '<h2 class="page">Wishlist</h2><div class="sub">little things you’ve had your eye on</div>';
    var w = (diary.w || []).map(function (s) { var p = String(s).split('~'); return { id: +p[0], unix: +p[1], name: p[2], url: p[3] }; });
    if (!w.length) return out + '<p class="empty">Touch a shop display wearing Vignette to pin it here.</p>';
    out += '<div class="wishes">';
    w.forEach(function (x) {
      out += '<div class="wish"><h4>' + esc(x.name) + '</h4><div class="row">'
        + (x.url ? '<a class="link" href="' + esc(x.url) + '" target="_blank">View</a><a class="link" href="' + esc(x.url) + '" target="_blank">Gift it</a>' : '')
        + '<button class="link" data-act="wishdel" data-id="' + x.id + '">Remove</button></div><div class="muted small" style="margin-top:8px">Pinned ' + esc(shortDate(x.unix)) + '</div></div>';
    });
    return out + '</div>';
  };

  PAGES.histoires = function () {
    var out = '<h2 class="page">Aunt Odile</h2><div class="sub">her letters, one chapter at a time</div>';
    var chap = core && core.ch ? core.ch[0] : 0, step = core && core.ch ? core.ch[1] : 0;
    LETTERS.forEach(function (ch, ci) {
      if (ci > chap) {
        out += '<div class="chapter"><div class="chapter-head"><span class="num">CHAPTER ' + (ci + 1) + '</span><h4 class="muted">' + esc(ch.title) + '</h4></div><div class="sealed"><span class="seal">O</span>Opens three days after the chapter before it ends.</div></div>';
        return;
      }
      var have = ci < chap ? 5 : step;
      out += '<div class="chapter"><div class="chapter-head"><span class="num">CHAPTER ' + (ci + 1) + '</span><h4>' + esc(ch.title) + '</h4></div>';
      for (var i = have - 1; i >= 0; i--) {
        var L = ch.letters[i];
        out += '<div class="odile"><div class="label" style="margin-bottom:8px">Letter ' + (i + 1) + ' of 5</div><div class="greet">' + esc(L.greet) + '</div>'
          + L.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('')
          + '<div class="sign">' + esc(L.sign) + '</div>' + (L.ps ? '<p class="muted small"><i>' + esc(L.ps) + '</i></p>' : '') + '</div>';
      }
      if (have < 5) out += '<div class="sealed"><span class="seal">O</span>' + esc(ch.hints[have]) + ', and at least three days after the last letter.</div>';
      else if (ci === chap) out += '<p class="muted small" style="margin-top:10px">Chapter complete. ' + esc(ch.gift) + ' was sent to your inventory.</p>';
      out += '</div>';
    });
    return out;
  };

  var shopKind = 'piece';
  function shopItem(c, note) {
    var tags = [];
    c.r.split(',').filter(Boolean).forEach(function (x) { tags.push(RITUALS['RTPIS'.indexOf(x)].name); });
    if (c.h) HOBBIES.forEach(function (hb) { if (hb.code === c.h) tags.push(hb.name); });
    return '<button class="item' + (c.k === 'refill' ? ' refill' : '') + '" data-act="shopview" data-id="' + c.id + '" data-name="' + esc(c.n) + '"><img src="' + esc(pieceImg(c)) + '" alt="" loading="lazy"><div class="iname">' + esc(c.n) + '</div>'
      + '<div class="iline">' + esc(c.line) + '</div>'
      + '<div class="itag">' + esc(note || tags.join(' · ')) + '</div>'
      + '<div class="iprice">L$' + c.p + '</div></button>';
  }
  PAGES.shop = function () {
    var out = '<h2 class="page">Shop</h2><div class="sub">little things to bring home</div>';
    out += '<div class="note-card"><div><h4>Thryft · ' + esc(SHOP_SLURL) + '</h4><p>Everything here is at the shop in-world, and on the Marketplace. Tap a piece to open its page.</p></div><button class="btn ghost" data-act="visit">Visit the shop</button></div>';
    out += '<div class="kinds">';
    ['piece', 'hobby', 'luxury', 'refillable'].forEach(function (k) {
      out += '<button class="kind ' + (shopKind === k ? 'on' : '') + '" data-act="shopkind" data-id="' + k + '">' + KIND_NAMES[k] + '</button>';
    });
    out += '</div><p class="muted small kind-note">' + ({
      piece: 'Everyday pieces for your rooms. Touch them for little moments that lift your rituals. Copy, so you can set them all over the house.',
      hobby: 'Each hobby has a kit you keep, and a supply you use up over five sessions. The last session leaves you a finished piece of your own.',
      luxury: 'Perfume, powder, and fresh flowers. They’re used up or dry over time, honestly, and stay behind as decor. No refills.',
      refillable: 'Candles, incense, film, stationery, and sealing wax run out. Each has its own refill, sold separately: rez the refill next to the piece and touch it.'
    })[shopKind] + '</p>';
    if (shopKind === 'hobby') {
      HOBBIES.forEach(function (hb) {
        var kit = CATALOG.filter(function (c) { return c.h === hb.code && (c.k === 'hobby' || c.k === 'refillable'); });
        var sup = CATALOG.filter(function (c) { return c.h === hb.code && c.k === 'supply'; });
        var fin = CATALOG.filter(function (c) { return c.h === hb.code && c.k === 'finished'; })[0];
        if (!kit.length && !sup.length) return;
        out += '<h3 class="section">' + esc(hb.name) + '</h3><div class="shop">';
        kit.forEach(function (c) { out += shopItem(c, c.k === 'refillable' ? 'Refillable · ' + (c.fit || 'refill') + ' sold separately' : 'The kit · ' + hb.name); });
        sup.forEach(function (c) { out += shopItem(c, 'Supply · five sessions, then ' + (fin ? 'a ' + fin.n : 'a piece of your own')); });
        out += '</div>';
      });
      return out;
    }
    if (shopKind === 'refillable') {
      out += '<div class="pairs">';
      CATALOG.filter(function (c) { return c.k === 'refillable'; }).forEach(function (c) {
        var ref = CATALOG.filter(function (r) { return r.k === 'refill' && r.fit === c.n; })[0];
        out += '<div class="pair">' + shopItem(c) + (ref ? '<span class="pair-plus">+</span>' + shopItem(ref, 'Its refill') : '') + '</div>';
      });
      return out + '</div>';
    }
    out += '<div class="shop">';
    CATALOG.filter(function (c) { return c.k === shopKind; }).forEach(function (c) { out += shopItem(c); });
    return out + '</div>';
  };

  // ============================================================
  //  ACTIONS
  // ============================================================

  function entryById(id) { return parseEntries().filter(function (e) { return e.id === id; })[0]; }

  function wire() {
    app.querySelectorAll('[data-tab]').forEach(function (b) {
      b.onclick = function () {
        if (b.getAttribute('data-tab') === 'stories') { if (window.VignetteStories) window.VignetteStories.open(); return; }
        tab = b.getAttribute('data-tab'); formFor = null; openLetter = null; render();
      };
    });
    app.querySelectorAll('[data-go]').forEach(function (b) {
      b.onclick = function () { tab = b.getAttribute('data-go'); render(); };
    });
    app.querySelectorAll('[data-act]').forEach(function (el) {
      el.onclick = function (ev) { ev.stopPropagation(); act(el.getAttribute('data-act'), el); };
    });
    var note = document.getElementById('note');
    if (note) note.onkeydown = function (ev) { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); act('note'); } };
  }

  function act(a, el) {
    var id = el ? Number(el.getAttribute('data-id')) : 0;
    if (a === 'note') {
      var nf = document.getElementById('note'), t = nf.value.trim(); if (!t) return;
      nf.value = '';
      post('diary', 'entry|' + bar(entryMood) + '|' + bar(t)).then(function () { entryMood = ''; toast('Kept on today’s page.'); setTimeout(load, 400); });
    }
    else if (a === 'mood') {
      var keep = document.getElementById('note') ? document.getElementById('note').value : '';
      entryMood = entryMood === el.getAttribute('data-m') ? '' : el.getAttribute('data-m'); render();
      var nf2 = document.getElementById('note'); if (nf2) { nf2.value = keep; nf2.focus(); }
    }
    else if (a === 'addline') { formFor = id; render(); var f = document.getElementById('line-' + id); if (f) f.focus(); }
    else if (a === 'cancelline') { formFor = null; render(); }
    else if (a === 'saveline') {
      var v = document.getElementById('line-' + id).value.trim(); if (!v) return;
      post('diary', 'line|' + id + '|' + bar(v)).then(function () { formFor = null; toast('Kept.'); setTimeout(load, 400); });
    }
    else if (a === 'tear') {
      var e = entryById(id); if (!e) return;
      var p = prose(e); var text = (timeWord(e.unix) + ', ' + dayName(e.unix) + '. ' + plain(p.html) + (e.line ? ' ' + e.line : '')).slice(0, 480);
      modal('Tear out this page', text, [{ key: 'to', ph: 'Send to (username)' }], 'Send it', function (vals) {
        if (!vals.to) return;
        post('mail', 'tear|' + bar(vals.to) + '|' + bar(text)).then(function (r) { toast(r.ok ? 'Folded and sent.' : (r.msg || 'That didn’t send.')); });
      });
    }
    else if (a === 'send') {
      var to = document.getElementById('to').value.trim(), body = document.getElementById('body').value.trim();
      if (!to || !body) { toast('Add a username and a few words.'); return; }
      post('mail', 'letter|' + bar(to) + '|' + bar(body)).then(function (r) { toast(r.ok ? 'Sealed and on its way.' : (r.msg || 'That didn’t send.')); if (r.ok) { document.getElementById('body').value = ''; } });
    }
    else if (a === 'reply') { tab = 'letters'; openLetter = null; render(); var toF = document.getElementById('to'); if (toF) { toF.value = ''; toF.placeholder = 'Their username (' + el.getAttribute('data-name') + ')'; toF.focus(); } }
    else if (a === 'open') {
      openLetter = openLetter === id ? null : id; render();
      post('mail', 'read|' + id).then(function () {
        mail = mail.map(function (s) { var p = String(s).split('~'); if (+p[0] === id) { p[6] = '1'; } return p.join('~'); });
      });
    }
    else if (a === 'gift') {
      var sp = el.getAttribute('data-sp');
      modal('Gift a spare', 'One spare ' + item(sp) + ' will leave your Keepsakes and arrive in theirs.', [{ key: 'to', ph: 'Send to (username)' }], 'Send it', function (vals) {
        if (!vals.to) return;
        post('core', 'gift|' + sp + '|' + bar(vals.to)).then(function (r) { toast(r.ok ? 'Wrapped and sent.' : (r.msg || 'That didn’t send.')); setTimeout(load, 600); });
      });
    }
    else if (a === 'maison') { post('core', 'maison').then(function () { toast('Counting your pieces…'); setTimeout(load, 6000); }); }
    else if (a === 'guide') { showGuide(); }
    else if (a === 'shopkind') { shopKind = el.getAttribute('data-id'); render(); }
    else if (a === 'shopview') { post('core', 'shop|' + el.getAttribute('data-id') + '|' + bar(el.getAttribute('data-name') || '')).then(function () { toast('Check your viewer: a window will offer to open it.'); }); }
    else if (a === 'visit') { post('core', 'visit').then(function () { toast('Your map is open at the Thryft shop.'); }); }
    else if (a === 'zoom') {
      var zsp = el.getAttribute('data-sp'), zp = zsp.split('.'), zs = SERIES[+zp[0]], spare = dupCount(+zp[0], +zp[1]);
      lightbox('<img class="zimg" src="' + esc(pic(zsp)) + '" alt=""><h3>' + esc(item(zsp)) + '</h3><div class="label">' + esc(zs.name) + ' · ' + rarity(+zp[0], +zp[1]) + '</div>'
        + (spare ? '<p class="muted small">You have ' + spare + (spare === 1 ? ' spare' : ' spares') + ' to gift.</p>' : ''));
    }
    else if (a === 'card') {
      var ci = Number(el.getAttribute('data-id')), cd = TAROT[ci];
      lightbox(cardHtml(ci, false, 'big') + '<h3>' + esc(cd[0]) + '</h3><p><b>Upright:</b> ' + esc(cd[1]) + '.</p><p><b>Reversed:</b> ' + esc(TAROT_REV[ci].charAt(0).toUpperCase() + TAROT_REV[ci].slice(1)) + '.</p>');
    }
    else if (a === 'star') {
      modal('Star this place', 'Wherever you’re standing right now. Add a little note if you like.', [{ key: 'note', ph: 'A note, like “Gynni’s house” (optional)', max: 80 }], 'Star it', function (vals) {
        post('core', 'star|' + bar(vals.note || '')).then(function () { toast('Starred.'); setTimeout(load, 500); });
      });
    }
    else if (a === 'unstar') { post('core', 'unstar|' + id).then(function () { setTimeout(load, 300); }); }
    else if (a === 'wishdel') { post('diary', 'wishdel|' + id).then(function () { setTimeout(load, 300); }); }
  }

  load();
})();
