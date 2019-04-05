// Load up the discord.js library
const Discord = require("discord.js");


// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
const ms = require("./index.js");

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Born To Snipe`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Born To Snipe`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Born To Snipe`);
});

client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', '╚»★«╝-ωεﾚς⊕mε-🙏');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField(':bust_in_silhouette: | name : ', `${member}`)
        .addField(':microphone2: | Welcome!', `EvilOP server aapka bohat bohat swagat karta he :metal:, ${member}`)
        .addField(':id: | User :', "**[" + `${member.id}` + "]**")
        .addField(':family_mwgb: | You are the member number...', `${member.guild.memberCount}`)
        .addField("Aapka naam", `<@` + `${member.id}` + `>`, true)
        .addField('Server', `${member.guild.name}`, true )
        .setFooter(`**${member.guild.name}**`)
        .setTimestamp()

        channel.sendEmbed(embed);
});

client.on('guildMemberRemove', member => {
    let channel = member.guild.channels.find('name', 'welcome-leave');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField('Name:', `${member}`)
        .addField('Has Let the Server', ':wave:')
        .addField('Alvida..', 'Yaad teri aayegi...Hamko bada satayegi!!')
        .addField('The server now has', `${member.guild.memberCount}` + " members")
        .setFooter(`**${member.guild.name}`)
        .setTimestamp()

        channel.sendEmbed(embed);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those
  
    if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
     
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    
    if(!message.member.roles.some(r=>["Leader", "MODERATOR", "STAFF", "HOUND", "OWNER", "LEADER", "Almighty"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!")
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Leader", "MODERATOR", "STAFF", "HOUND", "Mod", "LEADER", "OWNER", "Almighty"].includes(r.name)) )
      return message.reply("***Zinge tu nai kar sakta Noobde***");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("***Naam To Bata Saale...Kise Kick Karu?***");
    if(!member.kickable) 
      return message.reply("***Nai Kar sakta BSDKA Mod Ya Admin he***");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`***Sorry ${message.author} I couldn't kick because report is HIV+`));
    message.reply(`***${member.user.tag} Ko Laat Maar Di :NIKAL: ....***`);
     message.delete().catch(O_o=>{}); 

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Leader", "STAFF", "HOUND", "MODERATOR", "LEADER", "Almighty", "OWNER"].includes(r.name)) )
      return message.reply("***Zinge Tu nai kar sakta***");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("***Please mention a valid member of this server***");
    if(!member.bannable) 
      return message.reply("***I cannot ban this user! Admin ya Mod he BSDKA***");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of AIDS`));
    message.reply(`***${member.user.tag} is banned by ${message.author.tag} because: ${reason}....Gaand Mara***`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    if(!message.member.roles.some(r=>["Leader", "MODERATOR", "STAFF", "HOUND", "LEADER", "OWNER", "Almighty"].includes(r.name)) )
      return message.reply("***Beta Tumse Na HoPayegaa :Yeye: ***");
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("***Please provide a number between 2 and 100 for the number of messages to delete***");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`***Couldn't delete messages because of Constipation :poop:***`));
  }
  
  function checkBots(guild) {
  let botCount = 0; // This is value that we will return
  guild.members.forEach(member => { // We are executing this code for every user that is in guild
    if(member.user.bot) botCount++; // If user is a bot, add 1 to botCount value
  });
  return botCount; // Return amount of bots
}

function checkMembers(guild) {
    let memberCount = 0;
    guild.members.forEach(member => {
      if(!member.user.bot) memberCount++; // If user isn't bot, add 1 to value. 
    });
    return memberCount;
  }
  
   if(command === "serverinfo"){
      let sicon = message.guild.iconURL;
      let embed = new Discord.RichEmbed()
    .setDescription("Hamare server ki katha")
    .setThumbnail(sicon)
    .setColor('#f4df42')
    .addField('Server owner', message.guild.owner, true) // Will add in-line field with server owner
    .addField('Server region', message.guild.region, true) // Will add in-line field with server region
    .addField('Channel count', message.guild.channels.size, true) // Will add in-line field with total channel count
    .addField('Total member count', message.guild.memberCount) // Will add in-line field with total member count
    // Now we will use our methods that we've created before
    .addField('Humans', checkMembers(message.guild), true)
    .addField('Bots', checkBots(message.guild), true)
    // We also can add field with verification level of guild
    .addField('Verification level', message.guild.verificationLevel, true)
    // And now, we can finally add footer and timestamp
    .setFooter('Guild created at:')
    .setTimestamp(message.guild.createdAt);

    // And now we can send our embed
    return message.channel.send(embed);
  }

  if(command === "botinfo"){

    let boticon = client.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#15f153")
    .setThumbnail(boticon)
    .addField("Bot Name", client.user.username)
    .addField("Bot Create Date", client.user.createdAt)
    .addField("Servers", client.guilds.size);

   return message.channel.send(botembed);
  }
  
    if(command === "report"){

        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("Couldnt find the user");
        let reason = args.join(" ").slice(22);
    
        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Reports")
        .setColor("#660066")
        .addField("Reported User", `${rUser} with ID: ${rUser.id}`);
    
        message.channel.send(reportEmbed);
        return;
        
    }
  
  
  if(command === "mute") 
  {
    if(!message.member.roles.some(r=>["OWNER", "MODERATOR", "STAFF", "HOUND", "Mod", "LEADER", "Leader"].includes(r.name)) )
      return message.reply("Nai nai nai bete tum na kar paoge");
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Naam To bata Hawa me mute Maru ");
  let muterole = message.guild.roles.find(`name`, "muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  message.reply(`***Ab Kuch Nai Bolega Chup hi Holega <@${tomute.id}> muted :no_mouth: for ${ms(ms(mutetime))}***`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`***<@${tomute.id}> Ab Bol tu unmuted he*** :Yeye:`);
  }, ms(mutetime));


//end of module
}
  
  if(command === "unmute"){
    if(!message.member.roles.some(r=>["OWNER", "MODERATOR", "STAFF", "HOUND", "Mod", "LEADER", "Leader"].includes(r.name)) )
      return message.reply("Nai nai nai bete tum na kar paoge");
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let muterole = message.guild.roles.find(`name`, "muted");
    tomute.removeRole(muterole.id);
    message.channel.send(`***<@${tomute.id}> Ab Bol tu unmuted he*** :Yeye:`);
  }
  
  
  
  
  
  
  
 if(command === "whois"){
  let user = message.mentions.users.first() || message.author;
  let embed = new Discord.RichEmbed()
  .setAuthor(`${user.tag}'s Info`, user.displayAvatarURL)
  .setThumbnail(user.displayAvatarURL)
  .setColor('RANDOM')
  .addField('Username', user.username, true)
  .addField('ID:', user.id, true)
  .addField('Discrim', user.discriminator, true)
  .addField('Status', user.presence.status, true)
  .addField('Bot?', user.bot, true)
  .setThumbnail(user.displayAvatarURL)
  message.channel.send(embed);
}
  
 
  
  var jokes = [
    "What time did the man go to the dentist? Tooth hurt-y",
    "I'm reading a book about anti-gravity. It's impossible to put down!",
    "Want to hear a joke about a piece of paper? Never mind... it's tearable.",
    "I just watched a documentary about beavers. It was the best dam show I ever saw!",
    "If you see a robbery at an Apple Store does that make you an iWitness?",
    "Spring is here! I got so excited I wet my plants!",
    "A ham sandwich walks into a bar and orders a beer. The bartender says, \"Sorry we don’t serve food here.\"",
    "What’s Forrest Gump’s password? 1forrest1",
    "I bought some shoes from a drug dealer. I don't know what he laced them with, but I was tripping all day!",
    "Why do chicken coops only have two doors? Because if they had four, they would be chicken sedans!",
    "What do you call a factory that sells passable products? A satisfactory.",
    "A termite walks into a bar and asks, \"Is the bar tender here?\"",
    "When a dad drives past a graveyard: Did you know that's a popular cemetery? Yep, people are just dying to get in there!",
    "Two peanuts were walking down the street. One was a salted.",
    "Why did the invisible man turn down the job offer? He couldn't see himself doing it.",
    "I used to have a job at a calendar factory but I got the sack because I took a couple of days off.",
    "How do you make holy water? You boil the hell out of it.",
    "A three-legged dog walks into a bar and says to the bartender, \"I’m looking for the man who shot my paw.\"",
    "When you ask a dad if he's alright: \"No, I’m half left.\"",
    "I had a dream that I was a muffler last night. I woke up exhausted!",
    "How do you tell the difference between a frog and a horny toad? A frog says, \"Ribbit, ribbit\" and a horny toad says, \"Rub it, rub it.\"",
    "Did you hear the news? FedEx and UPS are merging. They’re going to go by the name Fed-Up from now on.",
    "5/4 of people admit that they’re bad with fractions.",
    "MOM: \"How do I look?\" DAD: \"With your eyes.\"",
    "What is Beethoven’s favorite fruit? A ba-na-na-na.",
    "What did the horse say after it tripped? \"Help! I’ve fallen and I can’t giddyup!\”",
    "Did you hear about the circus fire? It was in tents!",
    "Don't trust atoms. They make up everything!",
    "What do you get when you cross an elephant with a rhino? Elephino.",
    "How many tickles does it take to make an octopus laugh? Ten-tickles.",
    "What's the best part about living in Switzerland? I don't know, but the flag is a big plus.",
    "What do prisoners use to call each other? Cell phones.",
    "Why couldn't the bike standup by itself? It was two tired.",
    "What do you call a dog that can do magic? A Labracadabrador.",
    "Why didn't the vampire attack Taylor Swift? She had bad blood.",
    "NURSE: \"Blood type?\" DAD: \"Red.\"",
    "SERVER: \"Sorry about your wait.\" DAD: \"Are you saying I’m fat?\”",
    "What do you call a fish with two knees? A “two-knee” fish.",
    "I was interrogated over the theft of a cheese toastie. Man, they really grilled me.",
    "What do you get when you cross a snowman with a vampire? Frostbite.",
    "Can February March? No, but April May!",
    "When you ask a dad if they got a haircut: \"No, I got them all cut!\"",
    "What does a zombie vegetarian eat? “GRRRAAAAAIIIINNNNS!”",
    "What does an angry pepper do? It gets jalapeño your face.",
    "Why wasn't the woman happy with the velcro she bought? It was a total ripoff.",
    "What did the buffalo say to his son when he dropped him off at school? Bison.",
    "What do you call someone with no body and no nose? Nobody knows.",
    "Where did the college-aged vampire like to shop? Forever 21.",
    "You heard of that new band 1023MB? They're good but they haven't got a gig yet.",
    "Why did the crab never share? Because he's shellfish."
];

 if(command === "joke"){

      var DAD = new Discord.RichEmbed()
      .setDescription(jokes[Math.floor(Math.random() * jokes.length)])

      .setColor("0x#FF0000")

      message.channel.send(DAD);

}
  
  
  if(command === "warn"){
    var embedColor = '#0000ff' // Change this to change the color of the embeds!
    
    var missingPermissionsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the user is missing permissions
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('Insufficient Permissions!')
        .setDescription('You need the `MANAGE_MESSAGES` permission to use this command!')
        .setTimestamp();
    var missingArgsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the command isnt run right
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('Missing Arguments!')
        .setDescription('Usage: `warn [@User] [Reason]')
        .setTimestamp();
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionsEmbed); // Checks if the user has the permission
    let mentioned = message.mentions.users.first(); // Gets the user mentioned!
    if(!mentioned) return message.channel.send(missingArgsEmbed); // Triggers if the user donsn't tag a user in the message
    let reason = args.slice(1).join(' ') // .slice(1) removes the user mention, .join(' ') joins all the words in the message, instead of just sending 1 word
    if(!reason) return message.channe.send(missingArgsEmbed); // Triggers if the user dosn't provide a reason for the warning

    var warningEmbed = new Discord.RichEmbed() // Creates the embed that's DM'ed to the user when their warned!
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`You've been warned in ${message.guild.name}`)
        .addField('Warned by', message.author.tag)
        .addField('Reason', reason)
        .setTimestamp();
    mentioned.send(warningEmbed); // DMs the user the above embed!
    var warnSuccessfulEmbed = new Discord.RichEmbed() // Creates the embed thats returned to the person warning if its sent.
        .setColor(embedColor)
        .setTitle('User Successfully Warned!');
    message.channel.send(warnSuccessfulEmbed); // Sends the warn successful embed
    message.delete(); // Deletes the command
}
  
   if(command === "nick"){
    if(!message.member.roles.some(r=>["Leader", "MODERATOR", "STAFF", "HOUND", "Mod", "LEADER", "OWNER", "Almighty"].includes(r.name)) )
      return message.reply("***No U cant Do it boii***");
      let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member) return message.reply("Please mention a valid member of this server");
       let nickname = args.slice(1).join(' ');
    if(!nickname) nickname = "No nickname provided";
    
    await member.setNickname(nickname)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't change because of : ${error}`));
    
       
     }
  
 if(command === "senddm") {
    
    if(!message.member.roles.some(r=>["OWNER", "MODERATOR", "STAFF", "HOUND", "Mod", "Leader","Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
   
   let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
   
   member.send(reason);
 }
  
  
  
  if(command === "poll") {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This requires the permission: ADMINISTRATOR');

    if (!args[0]) return message.channel.send('Zinge tu admin nai he Samja!');

    const embed = new Discord.RichEmbed()
        .setColor(0xffffff)
        .setFooter('React to vote.')
        .setDescription(args.join(' '))
        .setTitle(`Poll created by ${message.author.username}`);

    let msg = await message.channel.send(embed);

    await msg.react('✅'); 
    await msg.react('❌');

    message.delete({timeout: 1000});

} 
  
});
  

client.login(process.env.token);
